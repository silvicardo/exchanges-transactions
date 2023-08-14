import React from "react";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { TimespanAmount } from "@/src/components/timespan-amount";
import { getFiatWithdrawalOperationsTotal } from "@/src/manager/balance/fiatWithdraw";
import AmountsTable from "@/src/components/amounts-table";

type Props = {
  timestamp: QueryTimespan;
};
export default async function Fiat({ timestamp }: Props) {
  const withdrawals = await getFiatWithdrawalOperationsTotal({
    timestamp,
  });

  return (
    <>
      <TimespanAmount
        amount={withdrawals.total}
        timestamp={timestamp}
        label={"Total EUR Withdrawals"}
        currencySymbol={"€"}
      />
      <AmountsTable
        caption={"EUR withdrawn by exchange"}
        dataKeyHead={"exchange"}
        amountSymbol={"€"}
        data={withdrawals.accounts}
      />
    </>
  );
}
