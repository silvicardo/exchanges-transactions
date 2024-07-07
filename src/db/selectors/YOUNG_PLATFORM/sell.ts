import { PrismaPromise, YoungPlatformTrade } from "@prisma/client";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { QueryTimespan, queryUtils } from "../utils";
import prisma from "../../../../client";
export const getAll = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: {
      side: "SELL",
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getAllToFiat = ({
  timestamp,
}: Partial<{ timestamp: Partial<QueryTimespan> }>) => {
  return prisma.youngPlatformTrade.findMany({
    where: {
      side: "SELL",
      quote: "EUR",
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getForPair = (
  config: Omit<TradeQueryConfig, "side">
): PrismaPromise<YoungPlatformTrade[]> => {
  const { pair, timestamp } = config;
  const [base, quote] = pair.split("_") as [PairQueryInput, PairQueryInput];
  const assetParams = {
    ...(base === "*" ? {} : { base }),
    ...(quote === "*" ? {} : { quote }),
  };
  const timestampQueryParam = !timestamp
    ? {}
    : { date: queryUtils.getTimespanQueryObject(timestamp) };
  return prisma.youngPlatformTrade.findMany({
    where: {
      side: "SELL",
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
