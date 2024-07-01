import {
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Skeleton,
  Box,
} from "@/src/components/chakra";
import { EXCHANGE_SELECTOR } from "@/src/app/_components/fiat-deposit-list-by-exchange/query-func";
import FiatDepositListByExchange from "../../../_components/fiat-deposit-list-by-exchange";
import { getYearTimestamp } from "@/src/utils/date";
import React, { Suspense } from "react";
import FiatDepositsTotalsByExchange from "@/src/app/_components/fiat-deposits-total-by-exchange";

export default function YearlyReportDeposits({
  params: { year },
}: {
  params: { year: string };
}) {
  return (
    <SimpleGrid column={1} spacing={8}>
      <Heading>Report {year} Deposits</Heading>
      <SimpleGrid column={1} spacing={8}>
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"445px"} />}>
              <FiatDepositsTotalsByExchange
                timestamp={getYearTimestamp(+year)}
              />
            </Suspense>
          </CardBody>
        </Card>
        {Object.keys(EXCHANGE_SELECTOR).map((exchangeName) => (
          <Suspense key={exchangeName} fallback={<Skeleton height={"445px"} />}>
            <FiatDepositListByExchange
              exchangeName={exchangeName}
              timestamp={getYearTimestamp(+year)}
            />
          </Suspense>
        ))}
      </SimpleGrid>
    </SimpleGrid>
  );
}
