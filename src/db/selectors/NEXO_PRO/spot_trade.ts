import { PairQueryInput, TradeQueryConfig } from "../types";
import { trim } from "lodash";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

/*
 * Nexo Pro actually never trades crypto -> fiat but only:
 *  - fiat -> crypto
 * - crypto -> crypto
 * this happens thanks to EURX stablecoin
 * fiat deposits are not allowed, you can deposit on base nexo and move here
 * fiatX and crypto deposits are accepted
 * Each trade actually happens to EURX and never to EUR currency
 * EURX is issued by Etoro
 * https://www.coinbase.com/it/price/etoro-euro
 * in italy this resulted as advantage before 2023 fiscal year since crpyto to crpyto
 * is not a taxable event even though it is a trade
 */
export const getForPair = async (config: TradeQueryConfig) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = trim(pair).split("_") as [
    PairQueryInput,
    PairQueryInput
  ];
  let assetParams = {};

  if (quote !== "*" && base !== "*") {
    assetParams = {
      ...assetParams,
      pair: `${quote}/${base}`,
    }
  }

  if (quote !== "*") {
    assetParams = {
      ...assetParams,
      pair: {
        contains: `/${quote}`,
      }
    };
  }

  if (base !== "*") {
    assetParams = {
      ...assetParams,
      pair: `${base}/`,
    };
  }
  const timestampQueryParam = !timestamp
    ? {}
    : { dateTime: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.nexoProSpotTransaction.findMany({
    where: {
      type: "market",
      status: "completed",
      side,
      ...assetParams,
      ...timestampQueryParam,
    },
  });
};
