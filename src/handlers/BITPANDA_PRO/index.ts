import { handle as depWithHandler } from "./deposit_withdraw";
import { handle as tradesHandler } from "./trades";

export const handlers = {
  deposit_withdraw: depWithHandler,
  trades: tradesHandler,
};
