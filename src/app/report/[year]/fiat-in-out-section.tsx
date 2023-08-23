import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Skeleton,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { getYearTimestamp } from "@/src/utils/date";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import { Amount } from "@/src/components/amount";
import { getFiatWithdrawalOperationsTotal } from "@/src/manager/balance/fiatWithdraw";

type QueryConfig = {
  timestamp?: Partial<QueryTimespan>;
};
const FiatDeposits = async ({ timestamp }: QueryConfig) => {
  const data = await getFiatDepositOperationsTotal({
    timestamp: timestamp,
  });
  return <Amount amount={data.total} label={`Deposits`} currencySymbol={"€"} />;
};

const FiatWithdrawals = async ({ timestamp }: QueryConfig) => {
  const data = await getFiatWithdrawalOperationsTotal({
    timestamp: timestamp,
  });
  return (
    <Amount amount={data.total} label={`Withdrawals`} currencySymbol={"€"} />
  );
};
export const FiatInOutSection = ({ year }: { year: number }) => {
  const timestamp = getYearTimestamp(year);
  return (
    <SimpleGrid column={1} spacing={2}>
      <Heading size={"md"} mb={4}>
        Fiat In/Out
      </Heading>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"57px"} />}>
              <FiatDeposits timestamp={timestamp} />
            </Suspense>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"57px"} />}>
              <FiatWithdrawals timestamp={timestamp} />
            </Suspense>
          </CardBody>
        </Card>
      </SimpleGrid>
    </SimpleGrid>
  );
};
