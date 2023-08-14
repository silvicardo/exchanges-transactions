import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import { ExchangeQueryResult, getWithdrawalsForExchange } from "./query-func";
import DataTable from "@/src/components/data-table";

type Props = {
  params: {
    exchangeName: string;
  };
  searchParams: {
    gte: Date;
    lte: Date;
  };
};

export default async function Deposit({
  params: { exchangeName },
  searchParams,
}: Props) {
  const withdrawals = await getWithdrawalsForExchange(exchangeName, {
    timestamp: searchParams,
  });
  return (
    <Container maxW={"container.xl"}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>{exchangeName}</Heading>
        <DataTable<ExchangeQueryResult[number]>
          caption={"EUR Withdrawals"}
          data={withdrawals}
        />
      </VStack>
    </Container>
  );
}
