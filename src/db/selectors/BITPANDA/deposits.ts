import { BitpandaTrade, PrismaPromise } from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

export const getAll = ({
  timestamp,
}: Omit<DepositQueryConfig, "currency"> = {}): PrismaPromise<
  BitpandaTrade[]
> => {
  return prisma.bitpandaTrade.findMany({
    where: {
      transactionType: "deposit",
      ...(timestamp
        ? { timestamp: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
/*
 * Bitpanda support only fiat EUR deposits so
 * it's harcoded here
 */
export const getFiat = ({
  timestamp,
}: Omit<DepositQueryConfig, "currency"> = {}): PrismaPromise<
  BitpandaTrade[]
> => {
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
