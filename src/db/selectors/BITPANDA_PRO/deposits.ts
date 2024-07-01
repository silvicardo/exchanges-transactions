import {
  BitpandaProDepositWithdraw,
  CurrencyName,
  PrismaPromise,
} from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

export const getAllByCurrency = ({
  currency,
  timestamp,
  timestampOrderBy,
}: DepositQueryConfig): PrismaPromise<BitpandaProDepositWithdraw[]> => {
  return prisma.bitpandaProDepositWithdraw.findMany({
    // @ts-expect-error
    where: {
      type: "Deposit",
      inOut: "Incoming",
      internalExternal: "External",
      currency: currency,
      ...(timestamp
        ? { timeCreated: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
    orderBy: { timeCreated: timestampOrderBy ?? "asc" },
  });
};

export const getFiat = ({
  timestamp,
  timestampOrderBy,
}: Pick<DepositQueryConfig, "timestamp" | "timestampOrderBy">) =>
  getAllByCurrency({ currency: "EUR", timestamp, timestampOrderBy });

export const getByCrypto = ({
  currency,
  timestamp,
}: {
  currency: Exclude<CurrencyName, "USD" | "EUR">;
} & Pick<DepositQueryConfig, "timestamp">) =>
  getAllByCurrency({ currency, timestamp });
