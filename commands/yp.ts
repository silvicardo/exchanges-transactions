import { parsers } from "../src/parsers/YOUNG_PLATFORM";
import argv from "process.argv";
import { Prisma, PrismaClient } from "@prisma/client";

const processArgv = argv(process.argv.slice(2));

interface Config {
  year: keyof typeof parsers;
  type: "buy_sell_swap";
  account_id: number;
}
const { year, type, account_id } = processArgv<Config>({
  year: "2023",
  type: "buy_sell_swap",
  account_id: 123456,
});

const prisma = new PrismaClient();

if (typeof parsers[year]?.[type] === "function") {
  parsers[year][type]()
    .then((transactions) => {
      return Promise.all(
        transactions.map(async ({ originalData, ...trans }) => {
          console.log("adding txnId", trans.txnId);
          const data = {
            ...trans,
            originalData: [originalData] as Prisma.JsonArray,
            userAccountId: account_id,
          };
          await prisma.youngPlatformTrade.upsert({
            where: { txnId: trans.txnId },
            create: data,
            update: data,
          });
          console.log("added txnId", trans.txnId);
        })
      );
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    })
    .finally(() => {
      console.log("DONE");
      prisma.$disconnect();
    });
}
