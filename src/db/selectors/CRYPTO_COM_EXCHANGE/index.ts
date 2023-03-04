import * as tradesSelectors from "./trades";
import * as withdrawalsSelectors from "./withdrawals";
import * as depositsSelectors from "./deposits";

export const selectors = {
  trades: tradesSelectors,
  withdrawals: withdrawalsSelectors,
  deposits: depositsSelectors,
};
