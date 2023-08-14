import React from "react";
import { Heading, VStack } from "@/src/components/chakra";
import Fiat from "@/src/app/withdrawal/fiat";
import { getLastYearTimestamp } from "@/src/utils/date";
export default async function Deposit() {
  return (
    <VStack align={"flex-start"} spacing={4}>
      <Heading>Withdrawals</Heading>
      <Fiat timestamp={getLastYearTimestamp()} />
    </VStack>
  );
}
