import { convertCSVtoJSON } from "../../../convertCSVtoJSON";
import {
  Prisma,
  PrismaClient,
  CurrencyName,
  CryptoComCryptoTransactionKind,
} from "@prisma/client";

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
  "Transaction Kind": CryptoComCryptoTransactionKind;
  "Transaction Hash"?: string;
};

type Parsed = Omit<
  Prisma.CryptoComCryptoTransactionCreateInput,
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
  };
};

const store = async ({
  parsed,
  userAccountId,
  prisma,
}: {
  parsed: Parsed[];
  userAccountId: number;
  prisma: PrismaClient;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...trans }) => {
      console.log(
        "Adding CryptoComApp crypto transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription}`
      );
      const timestampUtc = new Date(trans.timestampUtc).toISOString();
      const data = {
        ...trans,
        timestampUtc,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      const { id } = await prisma.cryptoComCryptoTransaction.upsert({
        where: { timestampUtc: timestampUtc },
        create: data,
        update: data,
      });
      console.log(
        "Adding CryptoComApp crypto transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription} > id: ${id}`
      );
    })
  );

export const handle = async ({
  year,
  userAccountId,
  prisma,
}: {
  year: "2021" | "2022" | "2023";
  userAccountId: number;
  prisma: PrismaClient;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/CRYPTO_COM_APP/crypto_transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
    prisma,
  });
};
