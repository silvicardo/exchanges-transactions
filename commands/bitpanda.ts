import { handlers } from "../src/db/handlers/BITPANDA";
import argv from "process.argv";
import prisma from "../client";

const processArgv = argv(process.argv.slice(2));

interface Config {
  account_id: number;
}
const { account_id } = processArgv<Config>({
  account_id: 123456,
});

if (account_id !== 123456) {
  handlers
    .trades({
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
