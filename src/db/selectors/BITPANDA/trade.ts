import { BitpandaTrade, PrismaPromise } from "@prisma/client";
import { queryUtils } from "../utils";
import { TradeQueryConfig } from "../types";
import { CryptoCurrency } from "../../../types";
import prisma from "../../../../client";

type Config = Omit<TradeQueryConfig, "pair"> & {
  crypto: CryptoCurrency | "*";
};

/*
 * Bitpanda support only fiat EUR from and to ops
 * so one of the sides will always be EUR
 */
export const getForFiatPair = ({
  crypto,
  side,
  timestamp,
}: Config): PrismaPromise<BitpandaTrade[]> => {
  const assetQueryParam = crypto === "*" ? {} : { asset: crypto };
  const timestampQueryParam = !timestamp
    ? {}
    : { timestamp: queryUtils.getTimespanQueryObject(timestamp) };
  return prisma.bitpandaTrade.findMany({
    where: {
      transactionType: side,
      ...assetQueryParam,
      assetClass: "Cryptocurrency",
      fiat: "EUR",
      ...timestampQueryParam,
    },
  });
};
