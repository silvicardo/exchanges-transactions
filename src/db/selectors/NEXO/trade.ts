import { PairQueryInput, TradeQueryConfig } from "../types";
import { trim } from "lodash";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

/*
 * Nexo actually never trades crypto -> fiat but only:
 *  - fiat -> crypto
 * - crypto -> crypto
 * this happens thanks to EURX stablecoin
 * fiat or crypto deposits are accepted and
 * for an italian customer:
 * - credit card/bank transfer deposit arrive in EUR and immediately convert to EURX
 * Each trade actually happens to EURX and never to EUR currency
 * EURX is issued by Etoro
 * https://www.coinbase.com/it/price/etoro-euro
 * in italy this results as advantage since crpyto to crpyto
 * is not a taxable event even though it is a trade
 */
export const getForPair = async (config: TradeQueryConfig) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = trim(pair).split("_") as [
    PairQueryInput,
    PairQueryInput
  ];
  let assetParams = {};

  if (quote !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "inputCurrency" : "outputCurrency"]: quote,
    };
  }

  if (base !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "outputCurrency" : "inputCurrency"]: base,
    };
  }
  const timestampQueryParam = !timestamp
    ? {}
    : { dateTime: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.nexoTransaction.findMany({
    where: {
      type: "Exchange",
      details: {
        contains: "approved",
      },
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
