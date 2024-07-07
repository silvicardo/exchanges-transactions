import {
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Skeleton,
  Box,
  CardHeader,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { database } from "@/src/db";
import { getYearTimestamp } from "@/src/utils/date";
import DataTable from "@/src/components/data-table";
import { DownloadForm } from "@/src/app/_components/fiat-deposit-list-by-exchange/download-form";
import { queryUtils } from "@/src/db/selectors/utils";
import prisma from "@/client";

const LiquidationSection = async ({ year }: { year: number }) => {
  const timestamp = getYearTimestamp(year);
  const repayedUsd = await database.selectors.nexo.borrow.getLiquidations({
    timestamp: timestamp,
  });
  const totalUsd = repayedUsd.reduce((acc, t) => acc + t.usdEquivalent, 0);
  const repayedEurx = await prisma.nexoTransaction.findMany({
    where: {
      type: {
        in: [
          //2023 csvs way, we do not care for the currency
          //usd equivalent will be always there
          "ManualSellOrder",
        ],
      },
      inputCurrency: "EURX",
      outputCurrency: "EURX",
      details: {
        contains: "approved / Fiat Repayment",
      },
      ...(timestamp
        ? { dateTime: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
  });
  const totalEurx = repayedEurx.reduce(
    (acc, t) => acc + Math.abs(t.inputAmount),
    0
  );
  const ordered = [...repayedUsd, ...repayedEurx].sort(
    (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
  );

  const displayData = ordered.map(
    ({
      id,
      type,
      inputCurrency,
      inputAmount,
      usdEquivalent,
      details,
      dateTime,
    }) => ({
      id,
      type,
      inputCurrency,
      inputAmount: inputAmount.toFixed(2),
      usdEquivalent,
      details,
      dateTime,
    })
  );
  return (
    <>
      <CardHeader>
        <HStack gap={12}>
          <strong>
            <Text fontSize="xl">
              Repayments: EURx {totalEurx.toFixed(2)}/USD {totalUsd.toFixed(2)}{" "}
            </Text>
          </strong>
          <DownloadForm
            stringifiedData={JSON.stringify(ordered)}
            fileName={`nexo_repayments_${timestamp.lte.getFullYear()}`}
            ctaText={"Download CSV"}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <DataTable caption={"Repayments"} data={displayData} />
      </CardBody>
    </>
  );
};
const BorrowSection = async ({ year }: { year: number }) => {
  const timestamp = getYearTimestamp(year);
  const borrowed = await database.selectors.nexo.borrow.getFiat({
    timestamp: timestamp,
  });
  const totalEur = borrowed.reduce(
    (acc, t) => acc + Math.abs(t.outputAmount),
    0
  );

  const totalUsd = borrowed.reduce(
    (acc, t) => acc + Math.abs(t.usdEquivalent),
    0
  );

  const displayData = borrowed.map(
    ({
      id,
      type,
      inputCurrency,
      inputAmount,
      outputAmount,
      outputCurrency,
      usdEquivalent,
      dateTime,
    }) => ({
      id,
      type,
      inputCurrency,
      inputAmount: inputAmount.toFixed(2),
      outputCurrency,
      outputAmount: outputAmount.toFixed(2),
      usdEquivalent,
      dateTime,
    })
  );

  return (
    <>
      <CardHeader>
        <HStack gap={12}>
          <strong>
            <Text fontSize="xl">
              Borrowed: EUR {totalEur.toFixed(2)}/USD {totalUsd.toFixed(2)}
            </Text>
          </strong>
          <DownloadForm
            stringifiedData={JSON.stringify(borrowed)}
            fileName={`nexo_borrowed_${timestamp.lte.getFullYear()}`}
            ctaText={"Download CSV"}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <DataTable caption={"Borrowed"} data={displayData} />
      </CardBody>
    </>
  );
};

export default function ReportNexoBorrowPage({
  params: { year },
}: {
  params: { year: string };
}) {
  return (
    <SimpleGrid column={1} spacing={8}>
      <Heading>Report {year} Borrow Transactions</Heading>
      <Card>
        <Suspense fallback={<Skeleton height={"445px"} />}>
          <LiquidationSection year={+year} />
        </Suspense>
      </Card>
      <Card>
        <Suspense fallback={<Skeleton height={"445px"} />}>
          <BorrowSection year={+year} />
        </Suspense>
      </Card>
    </SimpleGrid>
  );
}
