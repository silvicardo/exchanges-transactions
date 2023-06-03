import { PrismaPromise, CryptoComExchangeTransaction } from "@prisma/client";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { trim } from "lodash";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

type RequiredPick<T extends keyof CryptoComExchangeTransaction> = Record<
  T,
  NonNullable<CryptoComExchangeTransaction[T]>
>;

export type CryptoComExchangeTradeTransaction = Omit<
  CryptoComExchangeTransaction,
  | "transactionType"
  | "sendAmount"
  | "sendCurrency"
  | "receiveAmount"
  | "receiveCurrency"
  | "feeAmount"
  | "feeCurrency"
> & {
  transactionType: "EXCHANGE";
} & RequiredPick<"sendAmount"> &
  RequiredPick<"sendCurrency"> &
  RequiredPick<"receiveAmount"> &
  RequiredPick<"receiveCurrency"> &
  RequiredPick<"feeAmount"> &
  RequiredPick<"feeCurrency">;

export const getAll = (): PrismaPromise<
  CryptoComExchangeTradeTransaction[]
> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: { transactionType: "EXCHANGE" },
  }) as PrismaPromise<CryptoComExchangeTradeTransaction[]>;
};

export const getForPair = (config: TradeQueryConfig) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = trim(pair).split("_") as [
    PairQueryInput,
    PairQueryInput
  ];
  let assetParams = {};
  if (quote !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "receiveCurrency" : "sendCurrency"]: quote,
    };
  }

  if (base !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "sendCurrency" : "receiveCurrency"]: base,
    };
  }
  const timestampQueryParam = !timestamp
    ? {}
    : { transactionTime: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.cryptoComExchangeTransaction.findMany({
    where: {
      transactionType: "EXCHANGE",
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
