import { handlers } from "../src/handlers/BITPANDA_PRO";
import argv from "process.argv";
import { PrismaClient } from "@prisma/client";

const processArgv = argv(process.argv.slice(2));

interface Config {
  year: "2021" | "2022" | "2023";
  type: "trades" | "deposit_withdraw";
  account_id: number;
}
const { year, type, account_id } = processArgv<Config>({
  year: "2021",
  type: "trades",
  account_id: 123456,
});

const prisma = new PrismaClient();

if (
  ["2021", "2022", "2023"].includes(year) &&
  ["trades", "deposit_withdraw"].includes(type) &&
  account_id !== 123456
) {
  handlers[type]({
    prisma,
    year,
    userAccountId: +account_id,
  })
    .catch((e: any) => {
      console.log(e);
      process.exit(1);
    })
    .finally(() => {
      console.log("DONE");
      prisma.$disconnect();
    });
}
