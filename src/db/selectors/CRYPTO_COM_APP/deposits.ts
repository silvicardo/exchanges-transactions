import {
  PrismaClient,
  CryptoComFiatTransaction,
  CryptoComCryptoTransaction,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";

export const getAllFiat = (
  prisma: PrismaClient
): PrismaPromise<CryptoComFiatTransaction[]> => {
  return prisma.cryptoComFiatTransaction.findMany({
    where: {
      AND: [
        { transactionKind: { in: ["viban_card_top_up", "viban_deposit"] } },
        { currency: "EUR" },
        { toCurrency: "EUR" },
        { nativeCurrency: "EUR" },
      ],
    },
  });
};

export const getAllByCrypto = (
  prisma: PrismaClient,
  currency: Exclude<CurrencyName, "USD" | "EUR">
): PrismaPromise<CryptoComCryptoTransaction[]> => {
  {
    return prisma.cryptoComCryptoTransaction.findMany({
      where: {
        AND: [{ transactionKind: "crypto_deposit" }, { currency: currency }],
      },
    });
  }
};
