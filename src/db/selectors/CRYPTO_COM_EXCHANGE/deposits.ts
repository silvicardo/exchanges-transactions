import {
  CryptoComExchangeTransaction,
  PrismaClient,
  PrismaPromise,
} from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<CryptoComExchangeTransaction[]> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: { transactionType: "RECEIVE" },
  });
};
