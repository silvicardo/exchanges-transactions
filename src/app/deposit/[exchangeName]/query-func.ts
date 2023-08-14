import { database } from "@/src/db";
import { PromiseReturnType } from "@prisma/client/scripts/default-index";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { getLastYear } from "@/src/utils/date";

export const EXCHANGE_SELECTOR = {
  bitpanda: database.selectors.bitpanda.deposits.getFiat,
  bitpandaPro: database.selectors.bitpandaPro.deposits.getFiat,
  youngPlatform: database.selectors.youngPlatform.deposits.getAllFiat,
  nexo: database.selectors.nexo.deposits.getAllFiat,
  cryptoComApp: database.selectors.cryptoComApp.deposits.getAllFiat,
};

type Exchange = keyof typeof EXCHANGE_SELECTOR;

export type ExchangeQueryResult = PromiseReturnType<
  (typeof EXCHANGE_SELECTOR)[Exchange]
>;

export type Config = {
  timestamp?: Partial<QueryTimespan>;
};

export const getDepositsForExchange = async (name: string, config: Config) => {
  if (EXCHANGE_SELECTOR.hasOwnProperty(name)) {
    return EXCHANGE_SELECTOR[name as keyof typeof EXCHANGE_SELECTOR]({
      timestamp: {
        gte: new Date(config?.timestamp?.gte ?? `${getLastYear()}-01-01`),
        lte: new Date(config?.timestamp?.lte ?? `${getLastYear()}-12-31`),
      },
    });
  }
  return [];
};
