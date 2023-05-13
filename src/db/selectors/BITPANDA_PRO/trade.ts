import { PrismaClient } from "@prisma/client";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { queryUtils } from "../utils";

export const getForPair = (prisma: PrismaClient, config: TradeQueryConfig) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = pair.split("_") as [PairQueryInput, PairQueryInput];
  const assetParams = {
    ...(pair.includes("*") ? {} : { market: pair }),
    ...(base === "*" ? {} : { amountCurrency: base }),
    ...(quote === "*" ? {} : { priceCurrency: quote }),
  };
  const timestampQueryParam = !timestamp
    ? {}
    : { timeUtc: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.bitpandaProTrade.findMany({
    where: {
      type: side.toUpperCase() as Uppercase<TradeQueryConfig["side"]>,
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
