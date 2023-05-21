import {
  PrismaClient,
  BitpandaProDepositWithdraw,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";

export const getAllByCurrency = (
  prisma: PrismaClient,
  { currency, timestamp }: DepositQueryConfig
): PrismaPromise<BitpandaProDepositWithdraw[]> => {
  return prisma.bitpandaProDepositWithdraw.findMany({
    // @ts-expect-error
    where: {
      type: "Deposit",
      inOut: "Incoming",
      currency: currency,
      ...(timestamp
        ? { timeCreated: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getAllFiat = (prisma: PrismaClient) =>
  getAllByCurrency(prisma, { currency: "EUR" });

export const getFiat = (
  prisma: PrismaClient,
  { timestamp }: Pick<DepositQueryConfig, "timestamp">
) => getAllByCurrency(prisma, { currency: "EUR", timestamp });

export const getByCrypto = (
  prisma: PrismaClient,
  {
    currency,
    timestamp,
  }: {
    currency: Exclude<CurrencyName, "USD" | "EUR">;
  } & Pick<DepositQueryConfig, "timestamp">
) => getAllByCurrency(prisma, { currency, timestamp });
