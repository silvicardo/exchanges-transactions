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
  });
};

export const getAllFiat = () => getAllByCurrency({ currency: "EUR" });

export const getFiat = ({ timestamp }: Pick<DepositQueryConfig, "timestamp">) =>
  getAllByCurrency({ currency: "EUR", timestamp });

export const getByCrypto = ({
  currency,
  timestamp,
}: {
  currency: Exclude<CurrencyName, "USD" | "EUR">;
} & Pick<DepositQueryConfig, "timestamp">) =>
  getAllByCurrency({ currency, timestamp });
