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
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { CRYPTO_CURRENCIES } from "@/src/constants";
import { getSellToFiatOperations } from "@/src/manager/trade/sell";
import { getYearTimestamp } from "@/src/utils/date";
import { CryptoCurrency } from "@/src/types";
import { DownloadForm } from "@/src/app/_components/fiat-deposit-list-by-exchange/download-form";
import DataTable from "@/src/components/data-table";
import { selectors } from "@/src/db/selectors";
import { database } from "@/src/db";

async function getSellToFiatOperationTotals(year: number) {
  const timestamp = getYearTimestamp(year);
  const queryCurrencies = ["*", ...CRYPTO_CURRENCIES] as const;
  //definitely not the most efficient way, i know...
  const results = await Promise.all(
    queryCurrencies.map((crypto) =>
      getSellToFiatOperations({
        crypto,
        timestamp: timestamp,
      })
    )
  );
  const [aggregated, ...byCrypto] = results.sort((a, b) => b.total - a.total);

  const byCryptoWithAmount = byCrypto.filter((c) => c.total > 0);
  return { aggregated, byCryptoWithAmount };
}

const ContentSection = async ({ year }: { year: number }) => {
  const { byCryptoWithAmount } = await getSellToFiatOperationTotals(+year);
  console.log("byCryptoWithAmount", byCryptoWithAmount);

  return (
    <SimpleGrid column={1} spacing={8}>
      {byCryptoWithAmount.map(
        ({ account, total, config: { crypto, timestamp } }) => (
          <Suspense
            key={`${crypto}_${year}`}
            fallback={<Skeleton height={"445px"} />}
          >
            <CryptoSales
              account={account}
              total={total}
              crypto={crypto as CryptoCurrency}
              timestamp={timestamp as { gte: Date; lte: Date }}
            />
          </Suspense>
        )
      )}
    </SimpleGrid>
  );
};

const CryptoExchangeSalesCardContent = async ({
  exchangeName,
  crypto,
  timestamp,
}: {
  crypto: CryptoCurrency;
  timestamp: {
    gte: Date;
    lte: Date;
  };
  exchangeName: string;
}) => {
  const { selectors } = database;
  let total = 0;
  let data: any[] = [];

  if (exchangeName === "bitpanda") {
    data = await selectors.bitpanda.trade.getForFiatPair({
      crypto: crypto,
      side: "sell",
      timestamp,
    });
    total = data.reduce((acc, curr) => acc + curr.amountFiat, 0);
  }
  if (exchangeName === "bitpandaPro") {
    data = await selectors.bitpandaPro.trade.getForPair({
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    });
    total = data.reduce((acc, curr) => acc + curr.price, 0);
  }

  if (exchangeName === "youngPlatform") {
    data = (
      await selectors.youngPlatform.sell.getForPair({
        pair: `${crypto}_EUR`,
        timestamp,
      })
    ).map(
      ({
        id,
        side,
        rate,
        volume,
        quote,
        amount,
        base,
        brokerage,
        brokerageCurrency,
        date,
        ...a
      }) => ({
        id,
        base,
        quote,
        side,
        rate,
        amount,
        brokerage,
        brokerageCurrency,
        date,
      })
    );

    total = data.reduce((acc, curr) => acc + curr.amount, 0);
  }
  if (exchangeName === "cryptoComApp") {
    data = await selectors.cryptoComApp.trade.getForPair({
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    });
    total = data.reduce((acc, curr) => {
      const amount = +curr.toAmount!;
      if (Number.isNaN(amount)) {
        throw new Error(`NaN crypto com app entry: ${JSON.stringify(curr)}`);
      }
      return acc + Math.abs(amount);
    }, 0);
  }
  if (exchangeName === "cryptoComExchange") {
    data = await selectors.cryptoComExchange.trades.getForPair({
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    });
    total = data.reduce((acc, curr) => {
      const amount = curr.receiveAmount ? Math.abs(curr.receiveAmount) : 0;
      return acc + amount;
    }, 0);
  }

  if (exchangeName === "nexo") {
    data = await selectors.nexo.trade.getForPair({
      pair: `${crypto}_EURX`,
      side: "sell",
      timestamp,
    });

    total = data.reduce((acc, curr) => {
      const amount = Math.abs(curr.outputAmount);
      return acc + amount;
    }, 0);
  }

  if (exchangeName === "nexoPro") {
    data = await selectors.nexoPro.spot_trade.getForPair({
      pair: `${crypto}_EUR`,
      side: "sell",
      timestamp,
    });
    total = data.reduce((acc, curr) => {
      const amount = Math.abs(curr.filledAmount);
      return acc + amount;
    }, 0);
  }
  if (data.length === 0) return null;

  return (
    <>
      <CardHeader>
        {exchangeName} - Total: {total}
        <DownloadForm
          stringifiedData={JSON.stringify(data)}
          fileName={`${exchangeName}_sales_to_fiat_${timestamp.lte.getFullYear()}`}
          ctaText={"Download CSV"}
        />
      </CardHeader>
      <CardBody>
        <DataTable caption={"EUR sales"} data={data} />
      </CardBody>
    </>
  );
};

const CryptoSales = async ({
  account,
  total,
  crypto,
  timestamp,
}: {
  account: Record<string, number>;
  total: number;
  crypto: CryptoCurrency;
  timestamp: {
    gte: Date;
    lte: Date;
  };
}) => {
  return (
    <>
      <Heading>
        {crypto} - Total: {total}
      </Heading>
      <SimpleGrid column={1} spacing={6}>
        {Object.entries(account).map(([exchange, total]) => (
          <Card key={exchange}>
            <Suspense key={exchange} fallback={<Skeleton height={"445px"} />}>
              <CryptoExchangeSalesCardContent
                exchangeName={exchange}
                crypto={crypto}
                timestamp={timestamp}
              />
            </Suspense>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};

export default async function FiatSales({
  params: { year },
}: {
  params: { year: string };
}) {
  return (
    <SimpleGrid column={1} spacing={8}>
      <Heading>Report {year} Fiat Sales</Heading>
      <Suspense fallback={<Skeleton height={"445px"} />}>
        <ContentSection year={+year} />
      </Suspense>
    </SimpleGrid>
  );
}
