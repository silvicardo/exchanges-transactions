import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformMovement,
} from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: { txType: "DEPOSIT" },
  });
};

export const getAllFiat = (
  prisma: PrismaClient,
  { timestamp }: Pick<DepositQueryConfig, "timestamp">
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      txType: "DEPOSIT",
      currency: "EUR",
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
