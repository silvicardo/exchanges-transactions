import { PrismaPromise, YoungPlatformMovement } from "@prisma/client";
import prisma from "../../../../client";
export const getAll = (): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "GIFTCARD_STEPDROP" }, { txType: "REFERRAL" }],
    },
  });
};
