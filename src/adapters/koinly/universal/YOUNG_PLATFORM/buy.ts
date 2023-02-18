import { KoinlyUniversal } from "../../types";
import { YoungPlatformTrade } from "@prisma/client";

//swap does not require any special handling
//since it is just a buy and sell with cryptcurrencies
export const handle = (t: YoungPlatformTrade): KoinlyUniversal => ({
  Date: t.date.toISOString(),
  "Sent Amount": t.amount,
  "Sent Currency": t.quote,
  "Received Amount": t.volume,
  "Received Currency": t.base,
  "Fee Amount": t.brokerage,
  "Fee Currency": t.brokerageCurrency,
  Label: `${t.base}-${t.quote} ${t.side}`,
  Description: `${t.base}-${t.quote} ${t.side}`,
});
