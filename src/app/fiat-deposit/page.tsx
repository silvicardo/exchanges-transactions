import React, { Suspense } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  Card,
  CardBody,
} from "@/src/components/chakra";
import Fiat from "@/src/app/fiat-deposit/fiat";
import { getYearTimestamp } from "@/src/utils/date";

export default async function Deposit() {
  return (
    <Box>
      <Heading mb={4}>Deposits</Heading>
      <SimpleGrid
        spacing={12}
        templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
      >
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"445px"} />}>
              <Fiat timestamp={getYearTimestamp(2021)} />
            </Suspense>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"445px"} />}>
              <Fiat timestamp={getYearTimestamp(2022)} />
            </Suspense>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Suspense fallback={<Skeleton height={"445px"} />}>
              <Fiat timestamp={getYearTimestamp(2023)} />
            </Suspense>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
