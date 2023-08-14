import { getFiatDepositOperationsTotal } from "@/src/manager/balance/fiatDeposit";
import { Container, VStack, Card, CardBody } from "@/src/components/chakra";
import React from "react";
import { getLastYear, getLastYearTimestamp } from "@/src/utils/date";
import { Amount } from "@/src/components/amount";
import Link from "next/link";

const LAST_YEAR_TIMESTAMP = getLastYearTimestamp();

export default async function Home() {
  const lastYearDeposits = await getFiatDepositOperationsTotal({
    timestamp: LAST_YEAR_TIMESTAMP,
  });

  return (
    <VStack align={"flex-start"} spacing={4}>
      <Card as={Link} href={"/deposit"}>
        <CardBody>
          <Amount
            amount={lastYearDeposits.total}
            label={`${getLastYear()} Total Fiat Deposits`}
            currencySymbol={"€"}
          />
        </CardBody>
      </Card>
    </VStack>
  );
}
