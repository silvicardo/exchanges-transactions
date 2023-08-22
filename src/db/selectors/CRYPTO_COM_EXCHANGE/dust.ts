import prisma from "@/client";
import { QueryTimespan, queryUtils } from "@/src/db/selectors/utils";
import { CryptoComExchangeDustConversion, PrismaPromise } from "@prisma/client";

export const get = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<CryptoComExchangeDustConversion[]> => {
  return prisma.cryptoComExchangeDustConversion.findMany({
    where: {
      status: "COMPLETED",
      toCurrency: "CRO",
      ...(timestamp
        ? { createTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
