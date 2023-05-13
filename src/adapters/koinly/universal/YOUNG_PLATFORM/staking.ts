import { YoungPlatformMovement } from "@prisma/client";

export const handle = (data: YoungPlatformMovement[]) => {
  return data
    .filter((tx) => tx.txType === "STAKING_REWARD")
    .map((o) => ({
      Date: o.date.toISOString(),
      "Sent Amount": o.debit,
      "Sent Currency": o.currency,
      "Received Amount": o.credit,
      "Received Currency": o.currency,
      "Fee Amount": 0,
      "Fee Currency": o.currency,
      Label: o.txType.toUpperCase(),
      Description: `${o.currency} ${o.txType.toUpperCase()} - Id: ${o.moveId}`,
    }));
};
