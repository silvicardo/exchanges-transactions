import {
  PrismaClient,
  BitpandaTrade,
  Prisma,
  PrismaPromise,
} from "@prisma/client";

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
  prisma: PrismaClient
): PrismaPromise<BitpandaTrade[]> => {
  return prisma.bitpandaTrade.findMany({
    where: {
      AND: [
        { transactionType: "deposit" },
        { assetClass: "Fiat" },
        { fiat: "EUR" },
      ],
    },
  });
};
