import React from "react";
import FiatDepositListByExchange from "../../_components/fiat-deposit-list-by-exchange";

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
  return (
    <FiatDepositListByExchange
      exchangeName={exchangeName}
      timestamp={searchParams}
    />
  );
}
