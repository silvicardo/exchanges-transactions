import {
  PrismaClient,
  NexoTransaction,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";

export const getAllFiat = (
  prisma: PrismaClient
): PrismaPromise<NexoTransaction[]> => {
  return prisma.nexoTransaction.findMany({
    where: {
      AND: [
        { type: "DepositToExchange" },
        { inputCurrency: "EUR" },
        { outputCurrency: "EURX" },
      ],
    },
  });
};

export const getAllByCrypto = (
  prisma: PrismaClient,
  currency: Exclude<CurrencyName, "USD" | "EUR">
): PrismaPromise<NexoTransaction[]> => {
  {
    return prisma.nexoTransaction.findMany({
      where: {
        AND: [
          { type: "TransferIn" },
          { inputCurrency: currency },
          { outputCurrency: currency },
        ],
      },
    });
  }
};
