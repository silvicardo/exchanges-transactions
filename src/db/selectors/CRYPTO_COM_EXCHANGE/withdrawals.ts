import { CryptoComExchangeTransaction, PrismaPromise } from "@prisma/client";
import prisma from "../../../../client";
import { QueryTimespan, queryUtils } from "../utils";

export const getAll = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<CryptoComExchangeTransaction[]> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: {
      transactionType: "SEND",
      ...(timestamp
        ? { transactionTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
