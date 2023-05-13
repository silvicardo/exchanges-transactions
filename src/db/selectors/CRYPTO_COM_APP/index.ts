import * as depositsSelectors from "./deposits";
import * as withdrawalsSelectors from "./withdrawal";

import * as tradeSelectors from "./trade";
export const selectors = {
  deposits: depositsSelectors,
  withdrawals: withdrawalsSelectors,
  trade: tradeSelectors,
};
