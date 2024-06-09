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

/**
 * This includes both credit(borrow) card spending and ATM withdrawals
 * @param timestamp
 */
export const getFiatCreditCardMovement = ({
  timestamp,
}: Pick<LiquidationQueryConfig, "timestamp">) => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: { in: ["CreditCardStatus", "CreditCardOverdraftAuthorization"] },
      details: {
        contains: "approved",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

/**
 * This is for borrowing fiat using bank transfer
 * @param timestamp
 */
export const getFiatBankTransfer = ({
  timestamp,
}: {
  timestamp?: Partial<QueryTimespan>;
}) => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: "WithdrawalCredit",
      details: {
        contains: "approved",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};

export const getFiat = ({
  timestamp,
}: {
  timestamp?: Partial<QueryTimespan>;
}) => {
  return prisma.nexoTransaction.findMany({
    where: {
      type: {
        in: [
          "CreditCardStatus",
          "CreditCardOverdraftAuthorization",
          "WithdrawalCredit",
          "NexoCardPurchase"
        ],
      },
      details: {
        contains: "approved",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
