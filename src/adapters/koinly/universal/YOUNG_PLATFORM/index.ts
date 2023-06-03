import { handle as handleWithdrawals } from "./withdrawals";
import { handle as handleDeposits } from "./deposits";
import { handle as handleStaking } from "./staking";
import { handle as handleAdmin } from "./admin";
import { handle as handleGift } from "./gift";
import { handle as handleTradeBuy } from "./trade_buy";
import { handle as handleTradeSell } from "./trade_sell";
import { database } from "../../../../db";
import { orderBy } from "lodash";
import { convertJSONtoCSV } from "../../../../../convertJSONtoCSV";

export const handle = async () => {
  const selectors = database.selectors.youngPlatform;
  const dbWithdrawals = await selectors.withdrawals.getAll();
  const dbDeposits = await selectors.deposits.getAll();

  const dbBuyTrades = await selectors.buy.getAll();

  const dbSellTrades = await selectors.sell.getAll();

  const dbGiftsMovements = await selectors.gift.getAll();
  const dbStakingMovements = await selectors.staking.getAll();

  const dbAdminMovements = await selectors.admin.getAll();

  const entries = [
    ...handleWithdrawals(dbWithdrawals),
    ...handleDeposits(dbDeposits),
    ...handleStaking(dbStakingMovements),
    ...handleAdmin(dbAdminMovements),
    ...handleGift(dbGiftsMovements),
    ...dbBuyTrades.map(handleTradeBuy),
    ...dbSellTrades.map(handleTradeSell),
  ];
  const sorted = orderBy(entries, [(obj) => new Date(obj.Date)], ["asc"]);

  return convertJSONtoCSV(
    sorted,
    "koinly_universal_with_staking_admin_gift.csv"
  );
};

handle();
