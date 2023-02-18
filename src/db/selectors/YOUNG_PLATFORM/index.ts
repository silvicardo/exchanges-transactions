import * as depositsSelectors from "./deposits";
import * as withdrawalsSelectors from "./withdrawals";
import * as buySelectors from "./buy";
import * as sellSelectors from "./sell";
export const selectors = {
  deposits: depositsSelectors,
  withdrawals: withdrawalsSelectors,
  buy: buySelectors,
  sell: sellSelectors,
};
