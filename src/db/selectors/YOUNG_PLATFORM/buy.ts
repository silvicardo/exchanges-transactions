import { PrismaPromise, YoungPlatformTrade } from "@prisma/client";
import prisma from "../../../../client";

export const getAll = (): PrismaPromise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: { side: "BUY" },
  });
};
