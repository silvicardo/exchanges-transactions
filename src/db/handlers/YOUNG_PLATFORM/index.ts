import { handle as handleBuySellSwap } from "./buySellSwap";
import { handle as handleDepositWithdrawFeeOrder } from "./depositWithdrawFeeOrder";

export const handlers = {
  buy_sell_swap: handleBuySellSwap,
  deposit_withdraw_fee_order: handleDepositWithdrawFeeOrder,
} as const;
