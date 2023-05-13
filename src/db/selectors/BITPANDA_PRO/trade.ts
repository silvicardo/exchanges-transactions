import { CurrencyName, Prisma, PrismaClient } from "@prisma/client";
import { QueryTimespan, queryUtils } from "../utils";

type PairQueryInput = CurrencyName | "*";

type Config = {
  pair: `${PairQueryInput}_${PairQueryInput}`;
  side: "buy" | "sell";
  timestamp?: Partial<QueryTimespan>;
};

export const getForPair = (prisma: PrismaClient, config: Config) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = pair.split("_") as [PairQueryInput, PairQueryInput];
  const assetParams = {
    ...(pair.includes("*") ? {} : { market: pair }),
    ...(base === "*" ? {} : { amountCurrency: base }),
    ...(quote === "*" ? {} : { priceCurrency: quote }),
  };
  const timestampQueryParam = !timestamp
    ? {}
    : { timeUtc: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.bitpandaProTrade.findMany({
    where: {
      type: side.toUpperCase() as Uppercase<Config["side"]>,
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
