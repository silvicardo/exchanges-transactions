import {
  PrismaClient,
  PrismaPromise,
  YoungPlatformMovement,
} from "@prisma/client";

export const getAll = (
  prisma: PrismaClient
): PrismaPromise<YoungPlatformMovement[]> => {
  return prisma.youngPlatformMovement.findMany({
    where: {
      OR: [{ txType: "WITHDRAWAL" }, { txType: "FEE" }],
    },
    orderBy: { date: "asc" },
  });
};
