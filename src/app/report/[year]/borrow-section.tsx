import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Skeleton,
  HStack,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { getYearTimestamp } from "@/src/utils/date";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { Amount } from "@/src/components/amount";
import { database } from "@/src/db";

type QueryConfig = {
  timestamp?: Partial<QueryTimespan>;
};

const Borrowed = async ({ timestamp }: QueryConfig) => {
  const data = await database.selectors.nexo.borrow.getFiat({
    timestamp: timestamp,
  });
  return (
    <>
      <Amount
        amount={data.reduce((acc, t) => acc + Math.abs(t.inputAmount), 0)}
        label={`Borrowed`}
        currencySymbol={"EUR"}
      />
      <Amount
        amount={data.reduce((acc, t) => acc + Math.abs(t.usdEquivalent), 0)}
        label={`Borrowed`}
        currencySymbol={"USD"}
      />
    </>
  );
};

const RepayedCardGroup = async ({ timestamp }: QueryConfig) => {
  const data = await database.selectors.nexo.borrow.getLiquidations({
    timestamp: timestamp,
  });

  const byCurrency = data.reduce((acc, t) => {
    if (!acc[t.inputCurrency]) {
      acc[t.inputCurrency] = 0;
    }
    acc[t.inputCurrency] += Math.abs(t.inputAmount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {Object.entries(byCurrency).map(([currency, amount], i) => (
        <Card key={currency}>
          <CardBody>
            <Suspense fallback={<Skeleton height={"57px"} />}>
              <Amount
                amount={amount}
                label={`Repayed`}
                currencySymbol={currency}
              />
            </Suspense>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export const BorrowSection = ({ year }: { year: number }) => {
  const timestamp = getYearTimestamp(year);
  return (
    <>
      <HStack spacing={8}>
        <SimpleGrid column={1} spacing={2}>
          <Heading size={"md"} mb={4}>
            Nexo Borrowed
          </Heading>
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          >
            <Card>
              <CardBody>
                <Suspense fallback={<Skeleton height={"57px"} />}>
                  <Borrowed timestamp={timestamp} />
                </Suspense>
              </CardBody>
            </Card>
          </SimpleGrid>
        </SimpleGrid>
        <SimpleGrid column={1} spacing={2}>
          <Heading size={"md"} mb={4}>
            Nexo Repayments
          </Heading>
          <HStack spacing={4}>
            <RepayedCardGroup timestamp={timestamp} />
          </HStack>
        </SimpleGrid>
      </HStack>
    </>
  );
};
