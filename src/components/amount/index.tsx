"use client";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

type Props = {
  label: string;
  amount: number;
  currencySymbol?: string;
};
export const Amount = ({
  amount,
  label,
  currencySymbol,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>
        {currencySymbol ?? ""} {amount.toFixed(2)}
      </StatNumber>
      {children}
    </Stat>
  );
};
