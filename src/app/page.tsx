import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import {
  Card,
  CardBody,
  SimpleGrid,
  Skeleton,
  Heading,
  Box,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { getYearTimestamp } from "@/src/utils/date";
import { Amount } from "@/src/components/amount";
import Link from "next/link";
import { getFiatWithdrawalOperationsTotal } from "@/src/manager/balance/fiatWithdraw";
import { database } from "@/src/db";
import { QueryTimespan } from "@/src/db/selectors/utils";

type QueryConfig = {
  timestamp?: Partial<QueryTimespan>;
};
const Borrowed = async ({ timestamp }: QueryConfig) => {
  const lastYearBorrowed = await database.selectors.nexo.borrow.getFiat({
    timestamp: timestamp,
  });
  return (
    <Amount
      amount={lastYearBorrowed.reduce((acc, t) => acc + t.usdEquivalent, 0)}
      label={`Fiat Equivalent Borrowed`}
      currencySymbol={"USD"}
    />
  );
};

const Repayed = async ({ gte, lte }: QueryTimespan) => {
  const lastYearRepayed = await database.selectors.nexo.borrow.getLiquidations({
    timestamp: { gte, lte },
  });
  return (
    <Amount
      amount={lastYearRepayed.reduce((acc, t) => acc + t.usdEquivalent, 0)}
      label={`Fiat Equivalent Repayed USD`}
      currencySymbol={"USD"}
    />
  );
};

const Deposits = async ({ timestamp }: QueryConfig) => {
  const lastYearDeposits = await getFiatDepositOperationsTotal({
    timestamp: timestamp,
  });
  return (
    <Amount
      amount={lastYearDeposits.total}
      label={`Fiat Deposits`}
      currencySymbol={"€"}
    />
  );
};

const Withdrawals = async ({ timestamp }: QueryConfig) => {
  const lastYearWithdrawals = await getFiatWithdrawalOperationsTotal({
    timestamp: timestamp,
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
      {[2021, 2022, 2023].map((year) => (
        <Box key={year} mb={8}>
          <Heading mb={4}>{year}</Heading>
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          >
            <Card as={Link} href={"/fiat-deposit"}>
              <CardBody>
                <Suspense fallback={<Skeleton height={"57px"} />}>
                  <Deposits timestamp={getYearTimestamp(year)} />
                </Suspense>
              </CardBody>
            </Card>
            <Card as={Link} href={"/fiat-withdrawal"}>
              <CardBody>
                <Suspense fallback={<Skeleton height={"57px"} />}>
                  <Withdrawals timestamp={getYearTimestamp(year)} />
                </Suspense>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Suspense fallback={<Skeleton height={"57px"} />}>
                  <Borrowed timestamp={getYearTimestamp(year)} />
                </Suspense>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Suspense fallback={<Skeleton height={"57px"} />}>
                  <Repayed {...getYearTimestamp(year)} />
                </Suspense>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      ))}
    </>
  );
}
