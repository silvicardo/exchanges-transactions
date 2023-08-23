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
} from "@/src/components/chakra";
import Link from "next/link";
import React, { Suspense } from "react";
import { getYearTimestamp } from "@/src/utils/date";
import { FiatInOutSection } from "@/src/app/report/[year]/fiat-in-out-section";
import { BorrowSection } from "@/src/app/report/[year]/borrow-section";
import { CryptoToFiatSellSection } from "@/src/app/report/[year]/crypto-to-fiat-sell-section";

export default async function YearlyReport({
  params: { year },
}: {
  params: { year: string };
}) {
  return (
    <SimpleGrid column={1} spacing={8}>
      <Heading>Report {year}</Heading>
      <SimpleGrid column={1} spacing={8}>
        <FiatInOutSection year={+year} />
        <BorrowSection year={+year} />
        <CryptoToFiatSellSection year={+year} />
      </SimpleGrid>
    </SimpleGrid>
  );
}
