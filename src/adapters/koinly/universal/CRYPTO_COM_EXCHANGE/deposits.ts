import { KoinlyUniversal } from "../../types";
import { CryptoComExchangeTransaction } from "@prisma/client";

export const handle = (
  deposit: CryptoComExchangeTransaction
): KoinlyUniversal => {
  return {
    Date: deposit.transactionTime.toISOString(),
    "Sent Amount": 0,
    "Sent Currency": deposit.sendCurrency!,
    "Received Amount": deposit.receiveAmount!,
    "Received Currency": deposit.receiveCurrency!,
    "Fee Amount": 0,
    "Fee Currency": deposit.receiveCurrency!,
    Label: `deposit ${deposit.receiveCurrency}`,
    Description: `DEPOSIT ${deposit.receiveCurrency}  - Id: ${deposit.transactionId}`,
  };
};
