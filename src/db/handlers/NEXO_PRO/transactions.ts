import { convertCSVtoJSON } from "../../../../convertCSVtoJSON";
import { Prisma, CurrencyName, NexoTransactionType } from "@prisma/client";
import prisma from "../../../../client";

type CsvInput = {
  Transaction: string;
  Type: NexoTransactionType;
  "Input Currency": CurrencyName;
  "Input Amount": number;
  "Output Currency": CurrencyName;
  "Output Amount": number;
  "USD Equivalent": `$${number}`;
  Details: string;
} & ({"Date / Time (UTC)": string} | {"Date / Time": string});

type Parsed = Omit<
  Prisma.NexoTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    Transaction: transactionId,
    Type: type,
    "Input Currency": inputCurrency,
    "Input Amount": inputAmount,
    "Output Currency": outputCurrency,
    "Output Amount": outputAmount,
    "USD Equivalent": usdEquivalent,
    Details: details
  } = input;
  const dateTime = "Date / Time (UTC)" in input ? input["Date / Time (UTC)"] : input["Date / Time"];
  return {
    transactionId,
    type: type.split(' ').join('') as NexoTransactionType,
    inputCurrency,
    inputAmount,
    outputCurrency,
    outputAmount,
    usdEquivalent: Number(usdEquivalent.replace("$", "")),
    details,
    dateTime: new Date(dateTime).toISOString(),
    originalData: JSON.stringify(input),
  };
};
const store = async ({
  parsed,
  userAccountId,
}: {
  parsed: Parsed[];
  userAccountId: number;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...trans }) => {
      console.log("Adding Nexo Transaction > txnId", trans.transactionId);
      const data = {
        ...trans,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };

      await prisma.nexoTransaction.upsert({
        where: { transactionId: trans.transactionId },
        create: data,
        update: data,
      });
      console.log("Added Nexo Transaction > txnId", trans.transactionId);
    })
  );

export const handle = async ({
  year,
  userAccountId,
}: {
  year: "2021" | "2022" | "2023";
  userAccountId: number;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/NEXO/transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
