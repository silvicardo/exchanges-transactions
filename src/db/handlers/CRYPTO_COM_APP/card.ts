import { convertCSVtoJSON } from "../../../../convertCSVtoJSON";
import { Prisma, CurrencyName, CryptoComCardTransaction } from "@prisma/client";
import prisma from "../../../../client";

type CsvInput = {
  "Timestamp (UTC)": string;
  "Transaction Description": string;
  Currency: CurrencyName;
  Amount: number;
  "To Currency"?: CurrencyName;
  "To Amount"?: number;
  "Native Currency": CurrencyName;
  "Native Amount": number;
  "Native Amount (in USD)": number;
  "Transaction Kind"?: CryptoComCardTransaction;
  "Transaction Hash"?: string;
};

type Parsed = Omit<
  Prisma.CryptoComCardTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    "Timestamp (UTC)": timestampUtc,
    "Transaction Description": transactionDescription,
    Currency: currency,
    Amount: amount,
    "To Currency": toCurrency,
    "To Amount": toAmount,
    "Native Currency": nativeCurrency,
    "Native Amount": nativeAmount,
    "Native Amount (in USD)": nativeAmountInUsd,
    "Transaction Kind": transactionKind,
    "Transaction Hash": transactionHash,
  } = input;

  return {
    timestampUtc,
    transactionDescription,
    currency,
    amount,
    toCurrency,
    toAmount,
    nativeCurrency,
    nativeAmount,
    nativeAmountInUsd,
    transactionKind,
    transactionHash,
    originalData: JSON.stringify(input),
  } as unknown as Parsed;
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
      console.log(
        "Adding CryptoComApp card transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription}`
      );
      const timestampUtc = new Date(trans.timestampUtc).toISOString();
      const data = {
        ...trans,
        timestampUtc,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      const { id } = await prisma.cryptoComCardTransaction.upsert({
        where: { timestampUtc: timestampUtc },
        create: data,
        update: data,
      });
      console.log(
        "Adding CryptoComApp card transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription} > id: ${id}`
      );
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
    `${year}/CRYPTO_COM_APP/card_transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
