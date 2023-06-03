import { database } from "../../../../db";
import { handle as handleTrade } from "./trades";
import { handle as handleDeposit } from "./deposits";
import { handle as handleWithdrawal } from "./withdrawals";
import { orderBy } from "lodash";
import { convertJSONtoCSV } from "../../../../../convertJSONtoCSV";

export const handle = async () => {
  const trades = await database.selectors.cryptoComExchange.trades.getAll();
  const deposits = await database.selectors.cryptoComExchange.deposits.getAll();
  const withdrawals =
    await database.selectors.cryptoComExchange.withdrawals.getAll();

  const entries = [
    ...trades.map(handleTrade),
    ...deposits.map(handleDeposit),
    ...withdrawals.map(handleWithdrawal),
  ];

  const sorted = orderBy(entries, [(obj) => new Date(obj.Date)], ["asc"]);

  return convertJSONtoCSV(
    sorted,
    "koinly_universal_crypto_com_exchange_full.csv"
  );
};

handle();
