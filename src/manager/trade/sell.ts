import { CurrencyName, PrismaClient } from "@prisma/client";
import { database } from "../../db";
import { QueryTimespan } from "../../db/selectors/utils";

export const getSellToFiatOperations = async ({
  crypto,
  timestamp,
}: {
  crypto: Exclude<CurrencyName, "EUR" | "USD" | "GBP"> | "*";
  timestamp?: Partial<QueryTimespan>;
}): Promise<{
  account: Record<string, number>;
  total: number;
}> => {
  const prisma = new PrismaClient();
  const { selectors } = database;

  const bitpanda = (
    await selectors.bitpanda.trade.getForFiatPair(prisma, {
      crypto: "*",
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.amountFiat, 0);

  const bitpandaPro = (
    await selectors.bitpandaPro.trade.getForPair(prisma, {
      pair: "*_EUR",
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.price, 0);

  return {
    account: {
      bitpanda,
      bitpandaPro,
    },
    total: bitpanda + bitpandaPro,
  };
};

getSellToFiatOperations({
  crypto: "*",
  timestamp: { gte: "2021-01-01", lte: "2022-12-31" },
}).then(console.log);
