import { PrismaPromise, CoinbaseTransaction } from "@prisma/client";
import { DepositQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";
export const getAllFiat = ({
  timestamp,
}: Pick<DepositQueryConfig, "timestamp">): PrismaPromise<
  CoinbaseTransaction[]
> => {
  return prisma.coinbaseTransaction.findMany({
    where: {
      transactionType: "Buy",
      asset: {
        notIn: ["EUR"],
      },
      ...(timestamp
        ? { timestamp: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
