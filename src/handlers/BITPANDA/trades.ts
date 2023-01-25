import {
  Prisma,
  CurrencyName,
  BitpandaFeeCurrencyName,
  PrismaClient,
} from "@prisma/client";
import { convertCSVtoJSON } from "../../../convertCSVtoJSON";

type CsvInput = {
  "Transaction ID": string;
  Timestamp: string;
  "Transaction Type": "deposit" | "buy" | "sell" | "withdrawal" | "transfer";
  "In/Out": "incoming" | "outgoing";
  "Amount Fiat": number;
  Fiat: string;
  "Amount Asset": "-" | number;
  Asset: string;
  "Asset market price": "-" | number;
  "Asset market price currency": string;
  "Asset class": "Fiat" | "Cryptocurrency";
  "Product ID": "-" | number;
  Fee: "-" | number;
  "Fee asset": string;
  Spread: "-" | number;
  "Spread Currency": string;
};

type Parsed = Omit<Prisma.BitpandaTradeCreateInput, "id" | "userAccountId"> & {
  originalData: string;
};
const parse = (input: CsvInput): Parsed => {
  const {
    "Transaction ID": transactionId,
    Timestamp: timestamp,
    "Transaction Type": transactionType,
    "In/Out": inOut,
    "Amount Fiat": amountFiat,
    Fiat: fiat,
    "Amount Asset": amountAsset,
    Asset: asset,
    "Asset market price": assetMarketPrice,
    "Asset market price currency": assetMarketPriceCurrency,
    "Asset class": assetClass,
    "Product ID": productId,
    Fee: fee,
    "Fee asset": feeAsset,
    Spread: spread,
    "Spread Currency": spreadCurrency,
  } = input;

  return {
    transactionId: transactionId,
    timestamp: timestamp,
    transactionType: transactionType,
    inOut: inOut,
    amountFiat: amountFiat,
    fiat: fiat as "EUR",
    amountAsset: amountAsset !== "-" ? +amountAsset : null,
    asset: asset as CurrencyName,
    assetMarketPrice: !isNaN(+assetMarketPrice) ? +assetMarketPrice : undefined,
    assetMarketPriceCurrency:
      assetMarketPriceCurrency !== "-"
        ? (assetMarketPriceCurrency as "EUR")
        : undefined,
    assetClass: assetClass,
    productId: productId !== "-" ? productId : undefined,
    fee: !isNaN(+fee) ? +fee : undefined,
    feeAsset:
      feeAsset !== "-" ? (feeAsset as BitpandaFeeCurrencyName) : undefined,
    spread: !isNaN(+spread) ? +spread : undefined,
    spreadCurrency:
      spreadCurrency !== "-" ? (spreadCurrency as CurrencyName) : undefined,
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
      console.log("adding Bitpanda trade > transactionId", trade.transactionId);
      const data = {
        ...trade,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.bitpandaTrade.upsert({
        where: { transactionId: trade.transactionId },
        create: data,
        update: data,
      });
      console.log("added  Bitpanda trade > transactionId", trade.transactionId);
    })
  );

export const handle = async ({
  userAccountId,
  prisma,
}: {
  userAccountId: number;
  prisma: PrismaClient;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `2021/BITPANDA/trades.csv`
  );
  const parsed = csvJsonData.map(parse);

  return store({
    parsed,
    userAccountId,
    prisma,
  });
};
