import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformMovement,
} from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: { txType: "DEPOSIT" },
  });
};

export const getAllFiat = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      AND: [{ txType: "DEPOSIT" }, { currency: "EUR" }],
    },
  });
};
