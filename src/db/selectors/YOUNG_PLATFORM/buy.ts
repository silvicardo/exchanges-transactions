import { PrismaClient, YoungPlatformTrade } from "@prisma/client";

export const getAll = (prisma: PrismaClient): Promise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: { side: "BUY" },
  });
};
