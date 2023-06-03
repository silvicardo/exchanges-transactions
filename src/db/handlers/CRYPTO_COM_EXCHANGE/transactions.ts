// @ts-ignore
import jsonData from "../../../../jsons/CRYPTO_COM_EXCHANGE/transactions.json";
import {
  Prisma,
  CurrencyName,
  CryptoComExchangeTransactionType,
  CryptoComExchangeTransactionTag,
} from "@prisma/client";
import { omit } from "lodash";
import prisma from "../../../../client";

type PossiblyEmpty<T> = T | null | undefined;

type TransactionWarning = {
  warningType: string;
  param1: string;
  param2: string;
};

type Input = {
  id: string;
  source: string;
  userApiId: string;
  category: string;
  transactionTime: Date;
  transactionType: CryptoComExchangeTransactionType;
  receiveCurrency: PossiblyEmpty<CurrencyName>;
  receiveAmount: PossiblyEmpty<number>;
  receiveWallet: PossiblyEmpty<string>;
  receiveAddress: PossiblyEmpty<string>;
  receiveTag: PossiblyEmpty<CryptoComExchangeTransactionTag>;
  sendCurrency: PossiblyEmpty<CurrencyName>;
  sendAmount: PossiblyEmpty<number>;
  sendWallet: PossiblyEmpty<string>;
  sendAddress: PossiblyEmpty<string>;
  sendTag: PossiblyEmpty<CryptoComExchangeTransactionTag>;
  feeCurrency: PossiblyEmpty<CurrencyName>;
  feeAmount: PossiblyEmpty<number>;
  comment: PossiblyEmpty<string>;
  sendWorth: number;
  receiveWorth: number;
  feeWorth: number;
  receiveGain: PossiblyEmpty<any>;
  ignored: boolean;
  transactionPurchases: any[];
  transactionWarnings: TransactionWarning[];
  transactionUrl: PossiblyEmpty<any>;
};

//CryptoComExchangeTransactionInput

type Parsed = Omit<
  Prisma.CryptoComExchangeTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & { originalData: string };

const parse = (input: Input): Parsed => {
  const omitted = omit(input, [
    "id",
    "userApiId",
    "transactionPurchases",
    "transactionWarnings",
  ]);
  return Object.assign(omitted, {
    transactionId: input.id,
    originalData: JSON.stringify(input),
  });
};

function getUTCTime(dateTimeString: string): Date {
  const dateTime = new Date(dateTimeString);
  const dateTimeNumber = dateTime.getTime();
  const dateTimeOffset = dateTime.getTimezoneOffset() * 60000;
  const dateTimeUTC = new Date();
  dateTimeUTC.setTime(dateTimeNumber - dateTimeOffset);

  return dateTimeUTC;
}

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
        "Adding Crypto Exchange transaction > txnId: ",
        `${trans.transactionId}}`
      );

      const data = {
        ...trans,
        transactionTime: getUTCTime(trans.transactionTime as string),
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      const { id } = await prisma.cryptoComExchangeTransaction.upsert({
        where: { transactionId: trans.transactionId },
        create: data,
        update: data,
      });
      console.log(
        "Adding CryptoComApp fiat transaction > txnId: ",
        `${trans.transactionId} > db id: ${id}`
      );
    })
  );

export const handle = async ({ userAccountId }: { userAccountId: number }) => {
  const originalData = jsonData as Input[];

  const parsed = originalData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
