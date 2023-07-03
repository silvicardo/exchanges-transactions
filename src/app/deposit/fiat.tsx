import React from "react";
import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import { QueryTimespan } from "@/src/db/selectors/utils";
import Total from "@/src/app/deposit/total";
import AccountTable from "@/src/app/deposit/account-table";

type Props = {
  timestamp: QueryTimespan;
};
export default async function Fiat({ timestamp }: Props) {
  const deposits = await getFiatDepositOperationsTotal({
    timestamp,
  });

  return (
    <>
      <Total total={deposits.total} timestamp={timestamp} />
      <AccountTable accounts={deposits.account} />
    </>
  );
}
