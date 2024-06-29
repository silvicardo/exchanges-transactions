import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import {
  Card,
  CardBody,
  SimpleGrid,
  Skeleton,
  Heading,
  Box,
  StatNumber,
} from "@/src/components/chakra";
import React, { Fragment, Suspense } from "react";
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
    <>
      <Amount
        amount={lastYearBorrowed.reduce(
          (acc, t) => acc + Math.abs(t.usdEquivalent),
          0
        )}
        label={`Fiat Equivalent Borrowed`}
        currencySymbol={"USD"}
      >
        <StatNumber>
          EUR{" "}
          {lastYearBorrowed
            .reduce((acc, t) => acc + Math.abs(t.outputAmount), 0)
            .toFixed(2)}
        </StatNumber>
      </Amount>
    </>
  );
};

const Repayed = async ({ timestamp }: QueryConfig) => {
  const lastYearRepayed = await database.selectors.nexo.borrow.getLiquidations({
    timestamp: timestamp,
  });
  const byCurrency = lastYearRepayed.reduce((acc, t) => {
    if (!acc[t.inputCurrency]) {
      acc[t.inputCurrency] = 0;
    }
    acc[t.inputCurrency] += Math.abs(t.inputAmount);
    return acc;
  }, {} as Record<string, number>);
  return (
    <Amount
      amount={lastYearRepayed.reduce((acc, t) => acc + t.usdEquivalent, 0)}
      label={`Fiat Equivalent Repayed`}
      currencySymbol={"USD"}
    >
      <StatNumber>
        {Object.entries(byCurrency).map(([currency, amount], i) => (
          <Fragment key={currency}>
            {currency}: {amount.toFixed(2)}{" "}
          </Fragment>
        ))}
      </StatNumber>
    </Amount>
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
                  <Repayed timestamp={getYearTimestamp(year)} />
                </Suspense>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      ))}
    </>
  );
}
