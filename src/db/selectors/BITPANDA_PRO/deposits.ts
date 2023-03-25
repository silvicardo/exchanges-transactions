import {
  PrismaClient,
  BitpandaProDepositWithdraw,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";

export const getAllByCurrency = (
  prisma: PrismaClient,
  currency: CurrencyName
): PrismaPromise<BitpandaProDepositWithdraw[]> => {
  return prisma.bitpandaProDepositWithdraw.findMany({
    where: {
      AND: [{ type: "Deposit" }, { inOut: "Incoming" }, { currency: currency }],
    },
  });
};

export const getAllFiat = (prisma: PrismaClient) =>
  getAllByCurrency(prisma, "EUR");

export const getAllByCrypto = (
  prisma: PrismaClient,
  currency: Exclude<CurrencyName, "USD" | "EUR">
) => getAllByCurrency(prisma, currency);
