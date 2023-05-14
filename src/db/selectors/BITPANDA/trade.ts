import { BitpandaTrade, PrismaClient, PrismaPromise } from "@prisma/client";
import { queryUtils } from "../utils";
import { TradeQueryConfig } from "../types";
import { CRYPTO_CURRENCIES } from "../../../constants";

type Config = Omit<TradeQueryConfig, "pair"> & {
  crypto: (typeof CRYPTO_CURRENCIES)[number] | "*";
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
