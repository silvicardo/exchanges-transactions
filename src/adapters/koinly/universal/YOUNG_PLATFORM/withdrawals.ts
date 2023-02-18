import { YoungPlatformMovement } from "@prisma/client";
import { KoinlyUniversal } from "../../types";

const handleWithdrawal = (o: YoungPlatformMovement): KoinlyUniversal => ({
  Date: o.date.toISOString(),
  "Sent Amount": o.debit,
  "Sent Currency": o.currency,
  "Received Amount": o.credit,
  "Received Currency": o.currency,
  "Fee Amount": 0,
  "Fee Currency": o.currency,
  Label: o.txType.toUpperCase(),
  Description: `${o.currency} ${o.txType.toUpperCase()} - Id: ${o.moveId}`,
});

const handleFee = (o: YoungPlatformMovement): KoinlyUniversal => ({
  Date: o.date.toISOString(),
  "Sent Amount": 0,
  "Sent Currency": o.currency,
  "Received Amount": o.credit,
  "Received Currency": o.currency,
  "Fee Amount": o.debit,
  "Fee Currency": o.currency,
  Label: o.txType.toUpperCase(),
  Description: `${o.currency} ${o.txType.toUpperCase()} - Id: ${o.moveId}`,
});

const getGroupedWithdrawalsFeesByDate = (data: YoungPlatformMovement[]) =>
  data.reduce<
    Record<string, Partial<Record<"FEE" | "WITHDRAWAL", KoinlyUniversal>>>
  >((acc, o) => {
    const date = o.date.toISOString();
    const txType = o.txType as "FEE" | "WITHDRAWAL";
    const handler = txType === "WITHDRAWAL" ? handleWithdrawal : handleFee;
    if (acc[date]) {
      acc[date][txType] = handler(o);
      return acc;
    }
    acc[date] = {
      [txType]: handler(o),
    };

    return acc;
  }, {}) as Record<
    string,
    Required<Record<"FEE" | "WITHDRAWAL", KoinlyUniversal>>
  >;

const getUnifiedEntryByGroupedWithdrawalFee = ({
  WITHDRAWAL,
  FEE,
}: Record<"FEE" | "WITHDRAWAL", KoinlyUniversal>): KoinlyUniversal => ({
  Date: WITHDRAWAL.Date,
  "Sent Amount": WITHDRAWAL["Sent Amount"],
  "Sent Currency": WITHDRAWAL["Sent Currency"],
  "Received Amount": WITHDRAWAL["Received Amount"],
  "Received Currency": WITHDRAWAL["Received Currency"],
  "Fee Amount": FEE["Fee Amount"],
  "Fee Currency": FEE["Fee Currency"],
  Label: WITHDRAWAL["Label"],
  Description: WITHDRAWAL["Description"],
});
export const handle = (data: YoungPlatformMovement[]) => {
  const groupedWithsWithFees = getGroupedWithdrawalsFeesByDate(data);

  return Object.values(groupedWithsWithFees).map<KoinlyUniversal>(
    getUnifiedEntryByGroupedWithdrawalFee
  );
};
