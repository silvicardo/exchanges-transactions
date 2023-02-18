import { handle as handleWithdrawals } from "./withdrawals";
import { handle as handleDeposits } from "./deposits";
import { handle as handleTradeBuy } from "./trade_buy";
import { handle as handleTradeSell } from "./trade_sell";
import { PrismaClient } from "@prisma/client";
import { database } from "../../../../db";
import { orderBy } from "lodash";
import { convertJSONtoCSV } from "../../../../../convertJSONtoCSV";

export const handle = async () => {
  const prisma = new PrismaClient();
  const selectors = database.selectors.youngPlatform;
  const dbWithdrawals = await selectors.withdrawals.getAll(prisma);
  const dbDeposits = await selectors.deposits.getAll(prisma);

  const dbBuyTrades = await selectors.buy.getAll(prisma);

  const dbSellTrades = await selectors.sell.getAll(prisma);

  const entries = [
    ...handleWithdrawals(dbWithdrawals),
    ...handleDeposits(dbDeposits),
    ...dbBuyTrades.map(handleTradeBuy),
    ...dbSellTrades.map(handleTradeSell),
  ];
  const sorted = orderBy(entries, [(obj) => new Date(obj.Date)], ["asc"]);

  return convertJSONtoCSV(sorted, "koinly_universal.csv");
};

handle();
