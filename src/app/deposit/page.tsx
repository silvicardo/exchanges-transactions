import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import Fiat from "@/src/app/deposit/fiat";
export default async function Deposit() {
  return (
    <Container>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>Deposit</Heading>
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
