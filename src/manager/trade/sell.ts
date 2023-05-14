import { CurrencyName, PrismaClient } from "@prisma/client";
import { CRYPTO_CURRENCIES } from "../../constants";
import { database } from "../../db";
import { QueryTimespan } from "../../db/selectors/utils";
import { CryptoCurrency } from "../../types";

type SellToFiatConfig = {
  crypto: CryptoCurrency | "*";
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

  const cryptoComApp = (
    await selectors.cryptoComApp.trade.getForPair(prisma, {
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => {
    const amount = +!curr.toAmount;
    if (Number.isNaN(amount)) {
      throw new Error(`NaN crypto com app entry: ${JSON.stringify(curr)}`);
    }
    return acc + Math.abs(amount);
  }, 0);

  const cryptoComExchange = (
    await selectors.cryptoComExchange.trades.getForPair(prisma, {
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => {
    const amount = curr.receiveAmount ? Math.abs(curr.receiveAmount) : 0;
    return acc + amount;
  }, 0);

  const nexo = (
    await selectors.nexo.trade.getForPair(prisma, {
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    })
  ).reduce((acc, curr) => {
    const amount = Math.abs(curr.outputAmount);
    return acc + amount;
  }, 0);

  return {
    config,
    account: {
      bitpanda,
      bitpandaPro,
      youngPlatform,
      cryptoComApp,
      cryptoComExchange,
      nexo,
    },
    total:
      bitpanda +
      bitpandaPro +
      youngPlatform +
      cryptoComApp +
      nexo +
      cryptoComExchange,
  };
};
// ts-node src/manager/trade/sell.ts
const queryCurrencies = ["*", ...CRYPTO_CURRENCIES] as const;
Promise.all(
  queryCurrencies.map((crypto) =>
    getSellToFiatOperations({
      crypto,
      timestamp: { gte: "2022-01-01", lte: "2022-12-31" },
    })
  )
).then((r) => r.forEach((d) => console.log(d.config.crypto, `${d.total} €`)));
