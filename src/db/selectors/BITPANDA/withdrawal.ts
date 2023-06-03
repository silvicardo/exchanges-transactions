import { BitpandaTrade, PrismaPromise } from "@prisma/client";
import prisma from "../../../../client";

/*
 * Bitpanda support only fiat EUR deposits so
 * it's harcoded here
 */
export const getFiat = (
  options?: Partial<{
    timestamp: Partial<{
      gte: Date;
      lte: Date;
    }>;
  }>
): PrismaPromise<BitpandaTrade[]> => {
  return prisma.bitpandaTrade.findMany({
    where: {
      AND: [
        { transactionType: "withdrawal" },
        { assetClass: "Fiat" },
        { fiat: "EUR" },
        { amountFiat: { gt: 0 } },
        { inOut: "outgoing" },
        {
          timestamp: {
            gte: new Date(
              options?.timestamp?.gte ?? "2021-01-01"
            ).toISOString(),
            lte: new Date(
              options?.timestamp?.lte ?? "2022-12-31"
            ).toISOString(),
          },
        },
      ],
    },
  });
};
