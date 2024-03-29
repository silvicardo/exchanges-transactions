import { CurrencyName } from "@prisma/client";

export const CRYPTO_CURRENCIES: Exclude<CurrencyName, "EUR" | "USD">[] = [
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
  "LUNC",
  "NEAR",
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
  "APE",
  "UST",
  "OP",
  "ARB",
  "COMP",
  "NU",
  "GRT",
  "CGLD",
];
