import { Prisma, CurrencyName, PrismaClient } from "@prisma/client";
import { convertCSVtoJSON } from "../../../convertCSVtoJSON";

type CsvInput = {
  "Order ID": string;
  "Trade ID": string;
  Type: "BUY" | "SELL";
  Market: `${CurrencyName}_${CurrencyName}`;
  Amount: number;
  "Amount Currency": CurrencyName;
  Price: number;
  "Price Currency": CurrencyName;
  Fee: number;
  "Fee Currency": CurrencyName;
  "Time (UTC)": string;
  "BEST_EUR Rate"?: number;
  "Account ID": string;
  "Account Name": string;
};

type Parsed = Omit<
  Prisma.BitpandaProTradeCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    "Order ID": orderId,
    "Trade ID": tradeId,
    Type: type,
    Market: market,
    Amount: amount,
    "Amount Currency": amountCurrency,
    Price: price,
    "Price Currency": priceCurrency,
    Fee: fee,
    "Fee Currency": feeCurrency,
    "Time (UTC)": timeUtc,
    "BEST_EUR Rate": bestEurRate,
    "Account ID": accountId,
    "Account Name": accountName,
  } = input;

  return {
    orderId,
    tradeId,
    type,
    market,
    amount,
    amountCurrency,
    price,
    priceCurrency,
    fee,
    feeCurrency,
    timeUtc,
    bestEurRate,
    accountId,
    accountName,
    originalData: JSON.stringify(input),
  };
};

const store = async ({
  parsed,
  userAccountId,
  prisma,
}: {
  parsed: Parsed[];
  userAccountId: number;
  prisma: PrismaClient;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...trade }) => {
      console.log("adding Bitpanda PRO trade > orderId", trade.orderId);
      const data = {
        ...trade,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.bitpandaProTrade.upsert({
        where: { orderId: trade.orderId },
        create: data,
        update: data,
      });
      console.log("added Bitpanda PRO trade > orderId", trade.orderId);
    })
  );

export const handle = async ({
  year,
  userAccountId,
  prisma,
}: {
  year: "2021" | "2022" | "2023";
  userAccountId: number;
  prisma: PrismaClient;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/BITPANDA_PRO/trades.csv`
  );
  const parsed = csvJsonData.map(parse);
  console.log("parsed", parsed[0]);
  return store({
    parsed,
    userAccountId,
    prisma,
  });
};
