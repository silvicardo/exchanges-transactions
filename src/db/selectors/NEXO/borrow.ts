import { CurrencyName } from "@prisma/client";
import { QueryTimespan, queryUtils } from "@/src/db/selectors/utils";
import prisma from "@/client";

type LiquidationQueryConfig = {
  currency?: CurrencyName;
  timestamp?: Partial<QueryTimespan>;
};

export const getLiquidations = ({
  currency,
  timestamp,
}: LiquidationQueryConfig) => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: "Liquidation",
      ...(currency
        ? { inputCurrency: currency, outputCurrency: currency }
        : {}),
      details: {
        contains: "approved",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getCreditCardPurchase = ({
  timestamp,
}: Pick<LiquidationQueryConfig, "timestamp">) => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: "CreditCardStatus",
      details: {
        contains: "approved",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
