import { Prisma, CurrencyName, PrismaClient } from "@prisma/client";
import { convertCSVtoJSON } from "../../../convertCSVtoJSON";

type CsvInput = {
  "Transaction ID": string;
  "External Transaction ID"?: string;
  Type: "Deposit" | "Withdrawal";
  "In/Out": "Incoming" | "Outgoing";
  "Internal/External": "Internal" | "External";
  Amount: number;
  Currency: CurrencyName;
  Fee: number;
  "Time Created": string;
  "Account ID": string;
  "Account Name": string;
};

type Parsed = Omit<
  Prisma.BitpandaProDepositWithdrawCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    "Transaction ID": transactionId,
    "External Transaction ID": externalTransactionId,
    Type: type,
    "In/Out": inOut,
    "Internal/External": internalExternal,
    Amount: amount,
    Currency: currency,
    Fee: fee,
    "Time Created": timeCreated,
    "Account ID": accountId,
    "Account Name": accountName,
  } = input;

  return {
    transactionId,
    externalTransactionId,
    type,
    inOut,
    internalExternal,
    amount,
    currency,
    fee,
    timeCreated,
    accountId,
    accountName,
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
    parsed.map(async ({ originalData, ...depWith }) => {
      console.log(
        "adding Bitpanda PRO deposit withdraw > transactionId",
        depWith.transactionId
      );
      const data = {
        ...depWith,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.bitpandaProDepositWithdraw.upsert({
        where: { transactionId: depWith.transactionId },
        create: data,
        update: data,
      });
      console.log(
        "added Bitpanda PRO deposit withdraw > transactionId",
        depWith.transactionId
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
    `${year}/BITPANDA_PRO/deposit_withdraw.csv`
  );
  const parsed = csvJsonData.map(parse);
  console.log("parsed", parsed[0]);
  return store({
    parsed,
    userAccountId,
    prisma,
  });
};
