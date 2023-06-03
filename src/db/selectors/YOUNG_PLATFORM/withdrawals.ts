import { PrismaPromise, YoungPlatformMovement } from "@prisma/client";
import prisma from "../../../../client";

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
    date: Partial<{
      gte: Date;
      lte: Date;
    }>;
  }>
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      txType: "WITHDRAWAL",
      currency: "EUR",
      date: {
        gte: new Date(options?.date?.gte ?? "2021-01-01").toISOString(),
        lte: new Date(options?.date?.lte ?? "2022-12-31").toISOString(),
      },
    },
    orderBy: { date: "asc" },
  });
};
