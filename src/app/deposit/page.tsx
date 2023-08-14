import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import Fiat from "@/src/app/deposit/fiat";
import { getLastYearTimestamp } from "@/src/utils/date";
export default async function Deposit() {
  return (
    <Container maxW={"container.xl"}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>Deposits</Heading>
        <Fiat timestamp={getLastYearTimestamp()} />
      </VStack>
    </Container>
  );
}
