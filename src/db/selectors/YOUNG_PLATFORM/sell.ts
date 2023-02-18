import { PrismaClient, YoungPlatformTrade } from "@prisma/client";
//TODO: must complete logic
export const getAll = (prisma: PrismaClient): Promise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: {
      OR: [{ side: "BUY" }, { side: "SELL" }],
    },
  });
};
