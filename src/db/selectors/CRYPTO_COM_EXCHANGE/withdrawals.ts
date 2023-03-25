import { CryptoComExchangeTransaction, PrismaClient } from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): Promise<CryptoComExchangeTransaction[]> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: { transactionType: "SEND" },
  });
};
