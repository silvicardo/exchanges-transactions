import React from "react";
import { Heading, Container, VStack } from "@/src/components/chakra";
import ListTable from "./list-table";
import { getDepositsForExchange } from "./query-func";

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
  const deposits = await getDepositsForExchange(exchangeName, {
    timestamp: searchParams,
  });
  return (
    <Container maxW={"container.xl"}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading>{exchangeName}</Heading>
        <ListTable data={deposits} />
      </VStack>
    </Container>
  );
}
