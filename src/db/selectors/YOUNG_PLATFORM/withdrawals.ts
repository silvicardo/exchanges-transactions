import { PrismaClient, YoungPlatformMovement } from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): Promise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "WITHDRAWAL" }, { txType: "FEE" }],
    },
    orderBy: { date: "asc" },
  });
};
