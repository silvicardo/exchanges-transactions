import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seedUsers";

const prisma = new PrismaClient();
async function createCurrencies() {
  await prisma.currency.createMany({
    data: (["EUR"] as const).map((c) => ({
      name: c,
      typology: "FIAT",
    })),
  });
  await prisma.currency.createMany({
    data: (
      [
        "BTC",
        "ETH",
        "SOL",
        "MATIC",
        "DOT",
        "LINK",
        "AVAX",
        "AAVE",
        "YFI",
        "DOGE",
        "BCH",
        "LTC",
        "XLM",
        "XRP",
        "DASH",
        "EOS",
        "XTZ",
        "UNI",
        "BAT",
        "ADA",
        "LUNA",
        "REPV2",
        "USDT",
        "USDC",
        "KNC",
        "MKR",
        "SUSHI",
        "SNX",
        "SAND",
        "MANA",
        "ENJ",
        "CRO",
        "UMA",
        "CHR",
        "VET",
        "GALA",
        "EGLD",
        "SHIB",
        "ALGO",
        "AXS",
        "ONE",
        "ELON",
        "KDA",
        "THETA",
        "ATOM",
        "NEXO",
        "EURX",
        "BEST",
        "FIL",
        "TRX",
        "ICP",
        "BNB",
        "FTT",
        "FTM",
        "PAXG",
        "YNG",
        "ETHW",
        "LUNA2",
        "LUNC",
        "NEAR",
        "UST",
      ] as const
    ).map((c) => ({
      name: c,
      typology: "CRYPTO",
    })),
  });
}
async function createExchanges() {
  await prisma.exchange.createMany({
    data: (
      [
        "YOUNG_PLATFORM",
        "CRYPTO_COM_APP",
        "CRYPTO_COM_EXCHANGE",
        "BITPANDA",
        "BITPANDA_PRO",
        "NEXO",
      ] as const
    ).map((name) => ({ name })),
  });
}

async function main() {
  await createCurrencies();
  await createExchanges();
  await seedUsers(prisma);
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
