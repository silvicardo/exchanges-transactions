import { CurrencyName } from "@prisma/client";
import { QueryTimespan } from "./utils";

export type PairQueryInput = CurrencyName | "*";

export type TradeQueryConfig = {
  pair: `${PairQueryInput}_${PairQueryInput}`;
  side: "buy" | "sell";
  timestamp?: Partial<QueryTimespan>;
};

export type DepositQueryConfig = {
  currency: CurrencyName | "*";
  timestamp?: Partial<QueryTimespan>;
};
