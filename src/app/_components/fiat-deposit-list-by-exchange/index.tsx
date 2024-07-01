"use server";
import React from "react";
import { Heading, Container, VStack, HStack } from "@/src/components/chakra";
import DataTable from "@/src/components/data-table";
import {
  ExchangeQueryResult,
  getDepositsForExchange,
} from "@/src/app/_components/fiat-deposit-list-by-exchange/query-func";
import { DownloadForm } from "@/src/app/_components/fiat-deposit-list-by-exchange/download-form";

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
      <VStack align={"flex-start"} spacing={6}>
        <HStack spacing={24}>
          <Heading>{exchangeName}</Heading>
          {deposits.length > 0 ? (
            <DownloadForm
              stringifiedData={JSON.stringify(deposits)}
              fileName={`${exchangeName}_deposits_${timestamp.lte.getFullYear()}`}
              ctaText={"Download CSV"}
            />
          ) : null}
        </HStack>
        <DataTable<ExchangeQueryResult[number]>
          caption={"EUR deposits"}
          data={deposits}
        />
      </VStack>
    </Container>
  );
}
