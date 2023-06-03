import { PrismaPromise, YoungPlatformTrade } from "@prisma/client";
import prisma from "../../../../client";
import { QueryTimespan, queryUtils } from "../utils";

export const getAll = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: {
      side: "BUY",
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
