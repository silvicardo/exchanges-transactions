import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformTrade,
} from "@prisma/client";
export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformTrade[]> => {
  return prisma.youngPlatformTrade.findMany({
    where: { side: "SELL" },
  });
};
