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
  timestampOrderBy,
}: Pick<DepositQueryConfig, "timestamp" | "timestampOrderBy">): PrismaPromise<
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
    orderBy: { date: timestampOrderBy ?? "asc" },
  });
};
