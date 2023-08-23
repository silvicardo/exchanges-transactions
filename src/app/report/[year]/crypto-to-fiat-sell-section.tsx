import {
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Skeleton,
} from "@/src/components/chakra";
import React, { Suspense } from "react";
import { getYearTimestamp } from "@/src/utils/date";
import { QueryTimespan } from "@/src/db/selectors/utils";
import { Amount } from "@/src/components/amount";
import { getSellToFiatOperations } from "@/src/manager/trade/sell";
import { CRYPTO_CURRENCIES } from "@/src/constants";

type QueryConfig = {
  timestamp?: Partial<QueryTimespan>;
};

const CryptoToFiat = async ({ timestamp }: QueryConfig) => {
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

  return (
    <SimpleGrid column={1} spacing={4}>
      <SimpleGrid column={1} spacing={4}>
        <Heading size={"sm"}>Aggregated Total</Heading>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
          <Card>
            <CardBody textAlign={"center"}>
              <Suspense fallback={<Skeleton height={"57px"} />}>
                <Amount
                  amount={aggregated.total}
                  label={`All Crypto to Fiat`}
                  currencySymbol={"EUR"}
                />
              </Suspense>
            </CardBody>
          </Card>
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid column={1} spacing={4}>
        <Heading size={"sm"}>By Exchange</Heading>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
          <Suspense fallback={<Skeleton height={"57px"} />}>
            {Object.entries(aggregated.account).map(([exchange, total]) => (
              <Card key={exchange}>
                <CardBody>
                  <Amount
                    amount={total}
                    label={exchange}
                    currencySymbol={"€"}
                  />
                </CardBody>
              </Card>
            ))}
          </Suspense>
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid column={1} spacing={4}>
        <Heading size={"sm"}>By Currency</Heading>
        <SimpleGrid
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
          <Suspense
            fallback={
              <>
                {queryCurrencies.map((c) => (
                  <Skeleton key={c} height={"57px"} />
                ))}
              </>
            }
          >
            {byCryptoWithAmount.map(({ total, config: { crypto } }) => (
              <Card key={crypto}>
                <CardBody>
                  <Amount
                    amount={total}
                    label={`${crypto}-EUR`}
                    currencySymbol={"€"}
                  />
                </CardBody>
              </Card>
            ))}
          </Suspense>
        </SimpleGrid>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export const CryptoToFiatSellSection = ({ year }: { year: number }) => {
  const timestamp = getYearTimestamp(year);
  return (
    <SimpleGrid column={1} spacing={2}>
      <Heading size={"md"} mb={4}>
        Crypto Sell To Fiat
      </Heading>
      <CryptoToFiat timestamp={timestamp} />
    </SimpleGrid>
  );
};
