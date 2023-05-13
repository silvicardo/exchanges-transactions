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

  const bitpanda = (
    await database.selectors.bitpanda.trade.getForFiatPair(prisma, {
      crypto: "*",
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.amountFiat, 0);

  return {
    account: {
      bitpanda,
    },
    total: bitpanda,
  };
};

getSellToFiatOperations({
  crypto: "*",
  timestamp: { gte: "2022-01-01", lte: "2022-12-31" },
}).then(console.log);
