import { PrismaPromise, YoungPlatformMovement } from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

export const getAll = (): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: { txType: "DEPOSIT" },
  });
};

export const getAllFiat = ({
  timestamp,
}: Pick<DepositQueryConfig, "timestamp">): PrismaPromise<
  YoungPlatformMovement[]
> => {
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
