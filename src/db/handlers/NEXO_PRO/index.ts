import { handle as handleTransactions } from "./transactions";

export const handlers = {
  spot_transactions: handleTransactions,
};
