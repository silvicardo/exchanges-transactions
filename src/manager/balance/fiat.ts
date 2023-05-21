import { PrismaClient } from "@prisma/client";
import { database } from "../../db";
import { QueryTimespan } from "../../db/selectors/utils";

type FiatDepositConfig = {
  timestamp?: Partial<QueryTimespan>;
};

export const getFiatDepositOperationsTotal = async (
  config: FiatDepositConfig
): Promise<{
  account: Record<string, number>;
  total: number;
  config: FiatDepositConfig;
}> => {
  const { timestamp } = config;
  const prisma = new PrismaClient();

  const bitpanda = (
    await database.selectors.bitpanda.deposits.getFiat(prisma, { timestamp })
  ).reduce((acc, curr) => acc + curr.amountFiat - (curr.fee || 0), 0);

  const bitpandaPro = (
    await database.selectors.bitpandaPro.deposits.getFiat(prisma, { timestamp })
  ).reduce((acc, curr) => acc + curr.amount - curr.fee, 0);

  const nexo = (
    await database.selectors.nexo.deposits.getAllFiat(prisma, { timestamp })
  ).reduce((acc, curr) => acc + curr.inputAmount, 0);

  const cryptoComApp = (
    await database.selectors.cryptoComApp.deposits.getAllFiat(prisma, {
      timestamp,
    })
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
    config,
  };
};

getFiatDepositOperationsTotal({
  timestamp: { gte: "2022-01-01", lte: "2022-12-31" },
}).then(console.log);
