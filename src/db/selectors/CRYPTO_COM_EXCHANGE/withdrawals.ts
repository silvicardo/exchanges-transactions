import { CryptoComExchangeTransaction, PrismaPromise } from "@prisma/client";
import prisma from "../../../../client";

export const getAll = (): PrismaPromise<CryptoComExchangeTransaction[]> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: { transactionType: "SEND" },
  });
};
