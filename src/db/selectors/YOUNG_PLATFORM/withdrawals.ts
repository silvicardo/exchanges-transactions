import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformMovement,
} from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "WITHDRAWAL" }, { txType: "FEE" }],
    },
    orderBy: { date: "asc" },
  });
};

export const getAllFiat = (
  prisma: PrismaClient,
  options?: Partial<{
    date: Partial<{
      gte: Date;
      lte: Date;
    }>;
  }>
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      AND: [
        { txType: "WITHDRAWAL" },
        { currency: "EUR" },
        {
          date: {
            gte: new Date(options?.date?.gte ?? "2021-01-01").toISOString(),
            lte: new Date(options?.date?.lte ?? "2022-12-31").toISOString(),
          },
        },
      ],
    },
    orderBy: { date: "asc" },
  });
};
