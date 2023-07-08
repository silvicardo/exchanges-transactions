import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import Fiat from "@/src/app/deposit/fiat";
export default async function Deposit() {
  return (
    <Container maxW={"container.xl"}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>Deposits</Heading>
        <Fiat
          timestamp={{
            gte: new Date("2022-01-01"),
            lte: new Date("2022-12-31"),
          }}
        />
      </VStack>
    </Container>
  );
}
