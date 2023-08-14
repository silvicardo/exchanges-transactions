import { PrismaPromise, YoungPlatformMovement } from "@prisma/client";
import prisma from "../../../../client";
import { QueryTimespan } from "@/src/db/selectors/utils";

export const getAll = (): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "WITHDRAWAL" }, { txType: "FEE" }],
    },
    orderBy: { date: "asc" },
  });
};

export const getAllFiat = (
  options?: Partial<{
    timestamp: Partial<QueryTimespan>;
  }>
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      txType: "WITHDRAWAL",
      currency: "EUR",
      date: {
        gte: new Date(options?.timestamp?.gte ?? "2021-01-01").toISOString(),
        lte: new Date(options?.timestamp?.lte ?? "2022-12-31").toISOString(),
      },
    },
    orderBy: { date: "asc" },
  });
};
