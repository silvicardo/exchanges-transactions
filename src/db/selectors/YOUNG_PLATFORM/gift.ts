import { PrismaPromise, YoungPlatformMovement } from "@prisma/client";
import prisma from "../../../../client";
import { QueryTimespan, queryUtils } from "../utils";
export const getAll = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "GIFTCARD_STEPDROP" }, { txType: "REFERRAL" }],
      ...(timestamp
        ? { date: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
};
