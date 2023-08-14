import React from "react";
import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import { QueryTimespan } from "@/src/db/selectors/utils";
import AccountTable from "@/src/app/deposit/account-table";
import { TimespanAmount } from "@/src/components/timespan-amount";

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
      <AccountTable accounts={deposits.account} />
    </>
  );
}
