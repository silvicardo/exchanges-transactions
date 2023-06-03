import { BitpandaTrade, PrismaPromise } from "@prisma/client";
import prisma from "../../../../client";
import { QueryTimespan, queryUtils } from "../utils";

/*
 * Bitpanda support only fiat EUR deposits so
 * it's harcoded here
 */
export const getFiat = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<BitpandaTrade[]> => {
  return prisma.bitpandaTrade.findMany({
    where: {
      transactionType: "withdrawal",
      assetClass: "Fiat",
      fiat: "EUR",
      amountFiat: { gt: 0 },
      inOut: "outgoing",
      ...(timestamp
        ? { timestamp: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
