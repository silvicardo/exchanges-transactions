"use client";
import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";
import { format } from "date-fns";
import { QueryTimespan } from "@/src/db/selectors/utils";

type Props = {
  total: number;
  timestamp: QueryTimespan;
};
export default function Total({ total, timestamp }: Props) {
  const formattedGte = format(new Date(timestamp.gte), "yyyy-MM-dd");
  const formattedLte = format(new Date(timestamp.lte), "yyyy-MM-dd");
  return (
    <Stat>
      <StatLabel>Total EUR Deposits</StatLabel>
      <StatNumber>€ {total.toFixed(2)}</StatNumber>
      <StatHelpText>
        {formattedGte} - {formattedLte}
      </StatHelpText>
    </Stat>
  );
}
