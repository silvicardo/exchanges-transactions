import { convertCSVtoJSON } from "@/convertCSVtoJSON";
import { Prisma, CurrencyName, NexoProSpotTransactionType, NexoProSpotTransactionSide, NexoProSpotTransactionStatus  } from "@prisma/client";
import prisma from "../../../../client";

type CsvInput = {
  id: number;
  timestamp: string;
  pair: `${CurrencyName}/${CurrencyName}`;
  side: NexoProSpotTransactionSide;
  type: NexoProSpotTransactionType
  price: number;
  executedPrice: number;
  triggerPrice: number | null;
  requestedAmount: number;
  filledAmount: number;
  tradingFee: number;
  feeCurrency: CurrencyName;
  status: NexoProSpotTransactionStatus;
  orderId: string
}

type Parsed = Omit<
  Prisma.NexoProSpotTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    id: transactionId,
    timestamp:dateTime,
    ...rest
  } = input;
  return {
    ...rest,
    transactionId,
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
      console.log("Adding Nexo Pro Spot Transaction > txnId", trans.transactionId);
      const data = {
        ...trans,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };

      await prisma.nexoProSpotTransaction.upsert({
        where: { transactionId: trans.transactionId },
        create: data,
        update: data,
      });
      console.log("Added Nexo Pro Transaction > txnId", trans.transactionId);
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
    `${year}/NEXO_PRO/spot_transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
