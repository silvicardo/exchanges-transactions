import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import DataTable from "@/src/components/data-table";
import {
  ExchangeQueryResult,
  getDepositsForExchange,
} from "@/src/app/_components/fiat-deposit-list-by-exchange/query-func";

type Props = {
  exchangeName: string;
  timestamp: {
    gte: Date;
    lte: Date;
  };
};

export default async function FiatDepositListByExchange({
  exchangeName,
  timestamp,
}: Props) {
  const deposits = await getDepositsForExchange(exchangeName, {
    timestamp,
  });
  return (
    <Container maxW={"container.xl"}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>{exchangeName}</Heading>
        <DataTable<ExchangeQueryResult[number]>
          caption={"EUR deposits"}
          data={deposits}
        />
      </VStack>
    </Container>
  );
}
