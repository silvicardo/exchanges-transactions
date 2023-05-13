import {
  BitpandaTrade,
  CurrencyName,
  PrismaClient,
  PrismaPromise,
} from "@prisma/client";
import { queryUtils, QueryTimespan } from "../utils";
import { TradeQueryConfig } from "../types";

type Config = Omit<TradeQueryConfig, "pair"> & {
  crypto: Exclude<CurrencyName, "EUR" | "USD" | "GBP"> | "*";
};

/*
 * Bitpanda support only fiat EUR from and to ops
 * so one of the sides will always be EUR
 */
export const getForFiatPair = (
  prisma: PrismaClient,
  { crypto, side, timestamp }: Config
): PrismaPromise<BitpandaTrade[]> => {
  const assetQueryParam = crypto === "*" ? {} : { asset: crypto };
  const timestampQueryParam = !timestamp
    ? {}
    : { timestamp: queryUtils.getTimespanQueryObject(timestamp) };
  return prisma.bitpandaTrade.findMany({
    where: {
      transactionType: side,
      ...assetQueryParam,
      assetClass: "Cryptocurrency",
      fiat: "EUR",
      ...timestampQueryParam,
    },
  });
};
