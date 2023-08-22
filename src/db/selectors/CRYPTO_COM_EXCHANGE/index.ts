import * as tradesSelectors from "./trades";
import * as withdrawalsSelectors from "./withdrawals";
import * as depositsSelectors from "./deposits";
import * as dustSelectors from "./dust";

export const selectors = {
  trades: tradesSelectors,
  withdrawals: withdrawalsSelectors,
  deposits: depositsSelectors,
  dust: dustSelectors,
};
