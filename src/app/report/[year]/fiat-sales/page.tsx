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
import React, { Fragment, Suspense } from "react";
import { CRYPTO_CURRENCIES } from "@/src/constants";
import { getSellToFiatOperations } from "@/src/manager/trade/sell";
import { getYearTimestamp } from "@/src/utils/date";
import { CryptoCurrency } from "@/src/types";
import { DownloadForm } from "@/src/app/_components/fiat-deposit-list-by-exchange/download-form";
import DataTable from "@/src/components/data-table";
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

const DownloadSalesCsvButton = async ({
  timestamp,
  exchangeName,
}: {
  exchangeName: string;
  timestamp: { gte: Date; lte: Date };
}) => {
  let data: string | any[] = [];
  if (exchangeName === "youngPlatform") {
    data = (
      await database.selectors.youngPlatform.sell.getAllToFiat({
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
        originalData,
      }) => ({
        id,
        pair: `${base}_${quote}`,
        side,
        rate,
        volume,
        amount,
        fees: `${brokerage} ${brokerageCurrency}`,
        date,
        originalData,
      })
    );
  }
  if (data.length === 0) return null;
  return (
    <DownloadForm
      stringifiedData={JSON.stringify(data)}
      fileName={`${exchangeName}_sales_to_fiat_${timestamp.lte.getFullYear()}`}
      ctaText={"Download CSV"}
    />
  );
};

const AggregatedTable = async ({
  account,
  timestamp,
}: {
  account: Record<string, number>;
  timestamp: {
    gte: Date;
    lte: Date;
  };
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Exchange</Th>
            <Th isNumeric>Total</Th>
            <Th>CSV</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(account).map(([name, total]) => (
            <Fragment key={name}>
              {(total as number) > 0 ? (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td isNumeric>{(total as number).toFixed(2)} EUR</Td>
                  <Td>
                    <Suspense fallback={<Skeleton height={"35px"} />}>
                      <DownloadSalesCsvButton
                        exchangeName={name}
                        timestamp={timestamp}
                      />
                    </Suspense>
                  </Td>
                </Tr>
              ) : null}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const ContentSection = async ({ year }: { year: number }) => {
  const { byCryptoWithAmount, aggregated } = await getSellToFiatOperationTotals(
    +year
  );

  return (
    <SimpleGrid column={1} spacing={8}>
      {aggregated ? (
        <Card>
          <CardHeader>Aggregated</CardHeader>
          <Suspense fallback={<Skeleton height={"445px"} />}>
            <AggregatedTable
              account={aggregated.account}
              timestamp={getYearTimestamp(year)}
            />
          </Suspense>
        </Card>
      ) : null}
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
  let displayData = null;

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
    data = await selectors.youngPlatform.sell.getForPair({
      pair: `${crypto}_EUR`,
      timestamp,
    });
    displayData = data.map(
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
      }) => ({
        id,
        pair: `${base}_${quote}`,
        side,
        rate,
        volume,
        amount,
        fees: `${brokerage} ${brokerageCurrency}`,
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
        <HStack gap={12}>
          <strong>
            {exchangeName} - Total: {total}
          </strong>
          <DownloadForm
            stringifiedData={JSON.stringify(data)}
            fileName={`${exchangeName}_sales_to_fiat_${crypto}_EUR_${timestamp.lte.getFullYear()}`}
            ctaText={"Download CSV"}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <DataTable caption={"EUR sales"} data={displayData ?? data} />
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
        {Object.keys(account).map((exchange) => (
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
