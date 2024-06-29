import { CurrencyName } from "@prisma/client";
import { QueryTimespan, queryUtils } from "@/src/db/selectors/utils";
import prisma from "@/client";

type LiquidationQueryConfig = {
  currency?: CurrencyName;
  timestamp?: Partial<QueryTimespan>;
};

export const getLiquidations = ({ timestamp }: LiquidationQueryConfig) => {
  return prisma.nexoTransaction.findMany({
    where: {
      OR: [
        //this was nexo pre 2023 borrowing repayment csvs way
        //liquidation was always in EURX, but you can look for other currencies
        {
          type: "Liquidation",
          details: {
            contains: "approved",
          },
          ...(timestamp
            ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
            : {}),
        },
        //2023 csvs way, we do not care for the currency
        //usd equivalent will be always there
        {
          type: "ManualRepayment",
          details: {
            contains: "approved",
          },
          ...(timestamp
            ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
            : {}),
        },
      ],
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
      type: {
        in: [
          "WithdrawalCredit",
          "LoanWithdrawal", //2023 - Nexo to Customer Bank Transfer
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
          "NexoCardPurchase", // also includes ATM withdrawals displayed on website as "Cash Withdrawal"
          "LoanWithdrawal", //2023 - Nexo to Customer Bank Transfer
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
