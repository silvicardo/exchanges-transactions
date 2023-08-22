import { database } from "@/src/db";
import { handle as handleTrade } from "./trades";
import { handle as handleDeposit } from "./deposits";
import { handle as handleWithdrawal } from "./withdrawals";
import { handle as handleDustConversion } from "./dust";
import { orderBy } from "lodash";
import { convertJSONtoCSV } from "@/convertJSONtoCSV";
import { format } from "date-fns";

export const handle = async () => {
  const trades = await database.selectors.cryptoComExchange.trades.getAll();
  const deposits = await database.selectors.cryptoComExchange.deposits.getAll();
  const withdrawals =
    await database.selectors.cryptoComExchange.withdrawals.getAll();
  const dustConversions = await database.selectors.cryptoComExchange.dust.get();

  const entries = [
    ...trades.map(handleTrade),
    ...deposits.map(handleDeposit),
    ...withdrawals.map(handleWithdrawal),
    ...dustConversions.map(handleDustConversion),
  ];

  const sorted = orderBy(entries, [(obj) => new Date(obj.Date)], ["asc"]);

  return convertJSONtoCSV(
    sorted,
    `convert/koinly/universal_crypto_com_exchange_${format(
      new Date(),
      "yyyy_MM_dd_HH_mm_ss"
    )}.csv`
  );
};
