import {
  PrismaClient,
  NexoTransaction,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";

export const getAllFiat = (
  prisma: PrismaClient,
  { timestamp }: Pick<DepositQueryConfig, "timestamp">
): PrismaPromise<NexoTransaction[]> => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: "DepositToExchange",
      inputCurrency: "EUR",
      outputCurrency: "EURX",
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getAllByCrypto = (
  prisma: PrismaClient,
  {
    currency,
    timestamp,
  }: {
    currency: Exclude<CurrencyName, "USD" | "EUR">;
  } & Pick<DepositQueryConfig, "timestamp">
): PrismaPromise<NexoTransaction[]> => {
  {
    return prisma.nexoTransaction.findMany({
      where: {
        type: "TransferIn",
        inputCurrency: currency,
        outputCurrency: currency,
        ...(timestamp
          ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
          : {}),
      },
    });
  }
};
