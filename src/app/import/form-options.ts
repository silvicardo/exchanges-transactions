export const YEAR_OPTIONS = ["2021", "2022", "2023"] as const;
export const EXCHANGE_OPTIONS = [
  "BITPANDA",
  "BITPANDA_PRO",
  "CRYPTO_COM_APP",
  "YOUNG_PLATFORM",
  "NEXO",
  "LEDGER",
] as const;

export const EXCHANGE_FILENAME_OPTIONS = {
  BITPANDA: ["trades"] as const,
  BITPANDA_PRO: ["deposit_withdraw", "trades"] as const,
  CRYPTO_COM_APP: [
    "card_transactions",
    "crypto_transactions",
    "fiat_transactions",
  ] as const,
  YOUNG_PLATFORM: ["buy_sell_swap", "deposit_withdraw_fee_order"] as const,
  NEXO: ["transactions"] as const,
  LEDGER: ["operations"] as const,
} satisfies Record<string, readonly string[]>;

export type ImportFieldValues = {
  year: (typeof YEAR_OPTIONS)[number];
  exchange: (typeof EXCHANGE_OPTIONS)[number];
  filename: (typeof EXCHANGE_FILENAME_OPTIONS)[(typeof EXCHANGE_OPTIONS)[number]][number];
  file: File;
};
