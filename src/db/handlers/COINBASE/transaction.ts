import { Prisma, CurrencyName, CoinbaseTransactionType } from "@prisma/client";
import { convertCSVtoJSON } from "../../../../convertCSVtoJSON";
import prisma from "../../../../client";

export type CsvInput = {
  Timestamp: string;
  "Transaction Type": string;
  Asset: CurrencyName;
  "Quantity Transacted": number;
  "Spot Price Currency": CurrencyName;
  "Spot Price at Transaction": number;
  Subtotal: number;
  "Total (inclusive of fees and/or spread)": number;
  "Fees and/or Spread": number;
  Notes: string;
};

type Parsed = Omit<
  Prisma.CoinbaseTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    Timestamp: timestamp,
    "Transaction Type": transactionType,
    Asset: asset,
    "Quantity Transacted": quantityTransacted,
    "Spot Price Currency": spotPriceCurrency,
    "Spot Price at Transaction": spotPriceAtTransaction,
    Subtotal: subtotal,
    "Total (inclusive of fees and/or spread)": totalInclusiveOfFeesAndOrSpread,
    "Fees and/or Spread": feesAndOrSpread,
    Notes: notes,
  } = input;

  return {
    timestamp: new Date(timestamp).toISOString(),
    transactionType: transactionType
      .split(" ")
      .join("_") as CoinbaseTransactionType,
    asset,
    quantityTransacted: String(quantityTransacted),
    spotPriceCurrency,
    spotPriceAtTransaction: String(spotPriceAtTransaction),
    subtotal: String(subtotal),
    totalInclusiveOfFeesAndOrSpread: String(totalInclusiveOfFeesAndOrSpread),
    feesAndOrSpread: String(feesAndOrSpread),
    notes,
    originalData: JSON.stringify(input),
  };
};

const store = async ({
  parsed,
  userAccountId,
}: {
  parsed: Parsed[];
  userAccountId: number;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...trans }) => {
      console.log("Adding Coinbase Operation > timestamp", trans.timestamp);
      const data = {
        ...trans,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.coinbaseTransaction.upsert({
        where: {
          timestamp: trans.timestamp,
        },
        create: data,
        update: data,
      });
      console.log("added Coinbase Operation > timestamp", trans.timestamp);
    })
  );

export const handle = async ({
  userAccountId,
  year,
}: {
  userAccountId: number;
  year: "2020" | "2021" | "2022" | "2023";
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/COINBASE/transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
