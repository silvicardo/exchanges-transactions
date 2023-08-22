import { DepositQueryConfig } from "@/src/db/selectors/types";
import { LedgerOperation, PrismaPromise } from "@prisma/client";
import prisma from "@/client";
import { queryUtils } from "@/src/db/selectors/utils";
export const get = ({
  timestamp,
  currency,
}: DepositQueryConfig): PrismaPromise<LedgerOperation[]> => {
  return prisma.ledgerOperation.findMany({
    where: {
      operationType: "OUT",
      currencyTicker: currency,
      ...(timestamp
        ? { operationDate: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getFiat = ({
  timestamp,
}: Pick<DepositQueryConfig, "timestamp">): PrismaPromise<LedgerOperation[]> => {
  return get({ timestamp, currency: "EUR" });
};
