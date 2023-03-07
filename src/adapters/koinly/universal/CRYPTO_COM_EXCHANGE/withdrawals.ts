import { KoinlyUniversal } from "../../types";
import { CryptoComExchangeTransaction } from "@prisma/client";

export const handle = (
  withdrawal: CryptoComExchangeTransaction
): KoinlyUniversal => {
  return {
    Date: withdrawal.transactionTime as unknown as string,
    "Sent Amount": withdrawal.sendAmount!,
    "Sent Currency": withdrawal.sendCurrency!,
    "Received Amount": withdrawal.receiveAmount!,
    "Received Currency": withdrawal.receiveCurrency!,
    "Fee Amount": withdrawal.feeAmount!,
    "Fee Currency": withdrawal.receiveCurrency!,
    Label: `withdrawal ${withdrawal.sendCurrency}`,
    Description: `WITHDRAWAL ${withdrawal.sendCurrency}  - Id: ${withdrawal.transactionId}`,
  };
};
