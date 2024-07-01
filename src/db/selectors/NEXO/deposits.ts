import { NexoTransaction, CurrencyName, PrismaPromise } from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

export const getAllFiat = ({
  timestamp,
  timestampOrderBy,
}: Pick<DepositQueryConfig, "timestamp" | "timestampOrderBy">): PrismaPromise<
  NexoTransaction[]
> => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: "DepositToExchange",
      inputCurrency: "EUR",
      outputCurrency: "EURX",
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
    orderBy: { dateTime: timestampOrderBy ?? "asc" },
  });
};

export const getAllByCrypto = ({
  currency,
  timestamp,
}: {
  currency: Exclude<CurrencyName, "USD" | "EUR">;
} & Pick<DepositQueryConfig, "timestamp">): PrismaPromise<
  NexoTransaction[]
> => {
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
