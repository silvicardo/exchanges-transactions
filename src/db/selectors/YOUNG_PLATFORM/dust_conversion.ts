import { PrismaPromise, YoungPlatformMovement, YoungPlatformTrade } from "@prisma/client";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { QueryTimespan, queryUtils } from "../utils";
import prisma from "../../../../client";
export const getAll = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): Promise<Array<[YoungPlatformMovement, YoungPlatformMovement]>> => {
  return prisma.youngPlatformMovement.groupBy({
    by: ['date'],
    where: {
      txType: "DUST_CONVERSION",
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
    _count: {
      date: true,
    }
  }).then(grouped => {
    // Then, use the results to perform a findMany operation
    return Promise.all(grouped.map(group =>
      prisma.youngPlatformMovement.findMany({
        where: {
          date: group.date,
          txType: "DUST_CONVERSION",
        },
      })
    ));
  }).then(results => {
    // Filter the results to only include groups with exactly two elements
    return results.filter(group => group.length === 2) as Array<[YoungPlatformMovement, YoungPlatformMovement]>;
  })
}
