import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformTrade,
} from "@prisma/client";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { queryUtils } from "../utils";
export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: { side: "SELL" },
  });
};
export const getForPair = (
  prisma: PrismaClient,
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
