import { CryptoComExchangeTradeTransaction } from "../../../../db/selectors/CRYPTO_COM_EXCHANGE/trades";
import { KoinlyUniversal } from "../../types";

export const handle = (
  trade: CryptoComExchangeTradeTransaction
): KoinlyUniversal => {
  return {
    Date: trade.transactionTime.toISOString(),
    "Sent Amount": trade.sendAmount,
    "Sent Currency": trade.sendCurrency,
    "Received Amount": trade.receiveAmount,
    "Received Currency": trade.receiveCurrency,
    "Fee Amount": trade.feeAmount,
    "Fee Currency": trade.feeCurrency,
    Label: `${trade.sendCurrency}-${trade.receiveCurrency}`,
    Description: `${trade.sendCurrency}-${trade.receiveCurrency}  - Id: ${trade.transactionId}`,
  };
};
