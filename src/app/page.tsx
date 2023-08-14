import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import {
  Card,
  CardBody,
  SimpleGrid,
  Skeleton,
  Heading,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { getLastYear, getLastYearTimestamp } from "@/src/utils/date";
import { Amount } from "@/src/components/amount";
import Link from "next/link";
import { getFiatWithdrawalOperationsTotal } from "@/src/manager/balance/fiatWithdraw";

const LAST_YEAR_TIMESTAMP = getLastYearTimestamp();

const Deposits = async () => {
  const lastYearDeposits = await getFiatDepositOperationsTotal({
    timestamp: LAST_YEAR_TIMESTAMP,
  });
  return (
    <Amount
      amount={lastYearDeposits.total}
      label={`Fiat Deposits`}
      currencySymbol={"€"}
    />
  );
};

const Withdrawals = async () => {
  const lastYearWithdrawals = await getFiatWithdrawalOperationsTotal({
    timestamp: LAST_YEAR_TIMESTAMP,
  });
  return (
    <Amount
      amount={lastYearWithdrawals.total}
      label={`Fiat Withdrawals`}
      currencySymbol={"€"}
    />
  );
};

export default async function Home() {
  return (
    <>
      <Heading mb={4}>{getLastYear()}</Heading>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card as={Link} href={"/fiat-deposit"}>
          <CardBody>
            <Suspense fallback={<Skeleton height={"57px"} />}>
              <Deposits />
            </Suspense>
          </CardBody>
        </Card>
        <Card as={Link} href={"/fiat-withdrawal"}>
          <CardBody>
            <Suspense fallback={<Skeleton height={"57px"} />}>
              <Withdrawals />
            </Suspense>
          </CardBody>
        </Card>
      </SimpleGrid>
    </>
  );
}
