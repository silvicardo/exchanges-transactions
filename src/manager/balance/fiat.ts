import { PrismaClient } from "@prisma/client";
import { database } from "../../db";

export const getFiatDepositOperationsTotal = async (): Promise<{
  account: Record<string, number>;
  total: number;
}> => {
  const prisma = new PrismaClient();

  const bitpanda = (
    await database.selectors.bitpanda.deposits.getAll(prisma)
  ).reduce((acc, curr) => acc + curr.amountFiat - (curr.fee || 0), 0);

  const bitpandaPro = (
    await database.selectors.bitpandaPro.deposits.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.amount - curr.fee, 0);

  const nexo = (
    await database.selectors.nexo.deposits.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.inputAmount, 0);

  const cryptoComApp = (
    await database.selectors.cryptoComApp.deposits.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.toAmount, 0);

  const youngPlatform = (
    await database.selectors.youngPlatform.deposits.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.credit, 0);

  return {
    account: {
      bitpanda,
      bitpandaPro,
      nexo,
      cryptoComApp,
      youngPlatform,
    },
    total: bitpanda + bitpandaPro + nexo + cryptoComApp + youngPlatform,
  };
};

getFiatDepositOperationsTotal().then(console.log);
