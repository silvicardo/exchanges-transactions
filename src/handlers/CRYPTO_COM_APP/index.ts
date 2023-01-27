import { handle as cardHandler } from "./card";
import { handle as fiatHandler } from "./fiat";
import { handle as cryptoHandler } from "./crypto";
export const handlers = {
  fiat_transactions: fiatHandler,
  crypto_transactions: cryptoHandler,
  card_transactions: cardHandler,
};
