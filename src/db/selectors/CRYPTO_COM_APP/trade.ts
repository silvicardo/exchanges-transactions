import { trim } from "lodash";
import { PairQueryInput, TradeQueryConfig } from "../types";
import { queryUtils } from "../utils";
import prisma from "../../../../client";

/*
 * Queries for both fiat <-> crypto
 * and crypto <-> crypto trades
 * buy crypto with fiat can be
 * - crypto_purchase ( buy with debit card )
 * - viban_purchase ( buy with fiat wallet balance )
 * sell crypto for fiat can be
 * - crypto_viban_exchange ( sell to fiat wallet balance )
 * crypto to crypto can be
 * - crypto_exchange
 */
export const getForPair = (config: TradeQueryConfig) => {
  const { pair, side, timestamp } = config;
  const [base, quote] = trim(pair).split("_") as [
    PairQueryInput,
    PairQueryInput
  ];
  let assetParams = {};
  if (base !== "*" && quote !== "*") {
    assetParams = {
      transactionDescription:
        side === "buy" ? `${quote} -> ${base}` : `${base} -> ${quote}`,
    };
  }

  if (quote !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "currency" : "toCurrency"]: quote,
    };
  }

  if (base !== "*") {
    assetParams = {
      ...assetParams,
      [side === "buy" ? "toCurrency" : "currency"]: base,
    };
  }
  const timestampQueryParam = !timestamp
    ? {}
    : { timestampUtc: queryUtils.getTimespanQueryObject(timestamp) };

  return prisma.cryptoComCryptoTransaction.findMany({
    where: {
      OR: [
        // fiat (wallet balance ) <-> crypto
        {
          transactionKind: {
            in:
              side === "buy"
                ? ["crypto_exchange", "viban_purchase"]
                : ["crypto_exchange", "crypto_viban_exchange"],
          },
          ...assetParams,
          ...timestampQueryParam,
        },
        // buy crypto with fiat debit card
        side === "buy" && ["*", "EUR"].includes(quote)
          ? {
              transactionKind: "crypto_purchase",
              ...(base !== "*"
                ? {
                    transactionDescription: `Buy ${base}`,
                    currency: base,
                  }
                : {
                    transactionDescription: {
                      contains: "Buy",
                    },
                  }),
              nativeCurrency: "EUR",
              ...timestampQueryParam,
            }
          : {},
      ],
    },
  });
};
