import { CurrencyName, PrismaClient } from "@prisma/client";
import { database } from "../../db";
import { QueryTimespan } from "../../db/selectors/utils";

type SellToFiatConfig = {
  crypto: Exclude<CurrencyName, "EUR" | "USD" | "GBP"> | "*";
  timestamp?: Partial<QueryTimespan>;
};
export const getSellToFiatOperations = async (
  config: SellToFiatConfig
): Promise<{
  account: Record<string, number>;
  total: number;
  config: SellToFiatConfig;
}> => {
  const { crypto, timestamp } = config;
  const prisma = new PrismaClient();
  const { selectors } = database;

  const bitpanda = (
    await selectors.bitpanda.trade.getForFiatPair(prisma, {
      crypto: crypto,
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.amountFiat, 0);

  const bitpandaPro = (
    await selectors.bitpandaPro.trade.getForPair(prisma, {
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.price, 0);

  const youngPlatform = (
    await selectors.youngPlatform.sell.getForPair(prisma, {
      pair: `${crypto}_EUR`,
      timestamp,
    })
  ).reduce((acc, curr) => acc + curr.amount, 0);

  return {
    config,
    account: {
      bitpanda,
      bitpandaPro,
      youngPlatform,
    },
    total: bitpanda + bitpandaPro + youngPlatform,
  };
};
// ts-node src/manager/trade/sell.ts
const queryCurrencies = ["*", "BTC", "ETH", "USDT", "USDC"] as const;
Promise.all(
  queryCurrencies.map((crypto) =>
    getSellToFiatOperations({
      crypto,
      timestamp: { gte: "2022-01-01", lte: "2022-12-31" },
    })
  )
).then((r) => r.forEach((d) => console.log(d.config.crypto, `${d.total} €`)));
