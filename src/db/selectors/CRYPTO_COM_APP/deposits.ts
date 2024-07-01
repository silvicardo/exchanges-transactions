import {
  CryptoComFiatTransaction,
  CryptoComCryptoTransaction,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

export const getAllFiat = ({
  timestamp,
  timestampOrderBy,
}: Pick<DepositQueryConfig, "timestamp" | "timestampOrderBy">): PrismaPromise<
  CryptoComFiatTransaction[]
> => {
  return prisma.cryptoComFiatTransaction.findMany({
    where: {
      transactionKind: { in: ["viban_card_top_up", "viban_deposit"] },
      currency: "EUR",
      toCurrency: "EUR",
      nativeCurrency: "EUR",
      ...(timestamp
        ? { timestampUtc: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
    orderBy: { timestampUtc: timestampOrderBy ?? "asc" },
  });
};

export const getAllByCrypto = ({
  currency,
  timestamp,
}: {
  currency: Exclude<CurrencyName, "USD" | "EUR">;
} & Pick<DepositQueryConfig, "timestamp">): PrismaPromise<
  CryptoComCryptoTransaction[]
> => {
  {
    return prisma.cryptoComCryptoTransaction.findMany({
      where: {
        transactionKind: "crypto_deposit",
        currency: currency,
        ...(timestamp
          ? { timestampUtc: queryUtils.getTimespanQueryObject(timestamp) }
          : {}),
      },
    });
  }
};
