"use client";
import { StatHelpText } from "@chakra-ui/react";
import React from "react";
import { format } from "date-fns";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { Amount } from "@/src/components/amount";

type AmountProps = Pick<
  React.ComponentProps<typeof Amount>,
  "label" | "amount" | "currencySymbol"
>;

type Props = AmountProps & {
  timestamp: QueryTimespan;
};
export const TimespanAmount = ({ timestamp, ...amountProps }: Props) => {
  const formattedGte = format(new Date(timestamp.gte), "yyyy-MM-dd");
  const formattedLte = format(new Date(timestamp.lte), "yyyy-MM-dd");
  return (
    <Amount {...amountProps}>
      <StatHelpText>
        {formattedGte} - {formattedLte}
      </StatHelpText>
    </Amount>
  );
};
