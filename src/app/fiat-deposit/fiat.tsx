import React from "react";
import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { TimespanAmount } from "@/src/components/timespan-amount";
import AmountsTable from "@/src/components/amounts-table";

type Props = {
  timestamp: QueryTimespan;
};
export default async function Fiat({ timestamp }: Props) {
  const deposits = await getFiatDepositOperationsTotal({
    timestamp,
  });

  return (
    <>
      <TimespanAmount
        amount={deposits.total}
        timestamp={timestamp}
        label={"Total EUR Deposits"}
        currencySymbol={"€"}
      />
      <AmountsTable
        caption={"EUR deposited by exchange"}
        dataKeyHead={"exchange"}
        amountSymbol={"€"}
        data={deposits.account}
        linkSearchParams={timestamp as Record<string, string>}
      />
    </>
  );
}
