import * as depositsSelectors from "./deposits";
import * as withdrawalsSelectors from "./withdrawals";
import * as buySelectors from "./buy";
import * as sellSelectors from "./sell";
import * as stakingSelectors from "./staking";
import * as adminSelectors from "./admin";
import * as giftSelectors from "./gift";
import * as dustConversionSelectors from "./dust_conversion";
export const selectors = {
  deposits: depositsSelectors,
  withdrawals: withdrawalsSelectors,
  buy: buySelectors,
  sell: sellSelectors,
  staking: stakingSelectors,
  admin: adminSelectors,
  gift: giftSelectors,
  dust_conversion: dustConversionSelectors,
};
