import { PrismaClient, BitpandaTrade, PrismaPromise } from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<BitpandaTrade[]> => {
  return prisma.bitpandaTrade.findMany({
    where: { transactionType: "deposit" },
  });
};
/*
 * Bitpanda support only fiat EUR deposits so
 * it's harcoded here
 */
export const getFiat = (
  prisma: PrismaClient,
  { timestamp }: Omit<DepositQueryConfig, "currency">
): PrismaPromise<BitpandaTrade[]> => {
  return prisma.bitpandaTrade.findMany({
    where: {
      transactionType: "deposit",
      assetClass: "Fiat",
      fiat: "EUR",
      ...(timestamp
        ? { timestamp: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
