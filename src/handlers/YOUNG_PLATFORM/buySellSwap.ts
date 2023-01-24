import { Prisma, PrismaClient } from "@prisma/client";
import { convertCSVtoJSON } from "../../../convertCSVtoJSON";

export type CsvInput = {
  id: number;
  base: string;
  quote: string;
  amount: number;
  volume: number;
  rate: number;
  brokerage: number;
  brokerage_currency: string;
  side: string;
  date: string;
};

type Parsed = Omit<
  Prisma.YoungPlatformTradeCreateInput,
  "userAccountId" | "id"
> & { txnId: number };

const parse = (input: CsvInput): Parsed => {
  const { brokerage_currency: brokerageCurrency, id, ...rest } = input;
  return {
    originalData: JSON.stringify(input),
    brokerageCurrency,
    txnId: id,
    ...rest,
  } as unknown as Parsed;
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
    parsed.map(async ({ originalData, ...trans }) => {
      console.log("adding buy_sell_swap txnId", trans.txnId);
      const data = {
        ...trans,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.youngPlatformTrade.upsert({
        where: { txnId: trans.txnId },
        create: data,
        update: data,
      });
      console.log("added buy_sell_swap txnId", trans.txnId);
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
    `${year}/YOUNG_PLATFORM/buy_sell_swap.csv`
  );
  const parsed = csvJsonData.map(parse);

  return store({
    parsed,
    userAccountId,
    prisma,
  });
};
