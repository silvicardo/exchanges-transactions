import { z } from "zod";
import {
  EXCHANGE_FILENAME_OPTIONS,
  EXCHANGE_OPTIONS,
  YEAR_OPTIONS,
} from "@/src/app/import/form-options";
import { zfd } from "zod-form-data";

const exchangeEnum = z.enum(EXCHANGE_OPTIONS);

const baseSchema = z.object({
  year: z.enum(YEAR_OPTIONS),
  file: z.any(), // override in client and server schemas
});

export const ypSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.YOUNG_PLATFORM),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.YOUNG_PLATFORM]),
});

export const bitpandaSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.BITPANDA),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA]),
});

export const bitpandaProSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.BITPANDA_PRO),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA_PRO]),
});

export const nexoSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.NEXO),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.NEXO]),
});

export const cryptoComAppSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.CRYPTO_COM_APP),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.CRYPTO_COM_APP]),
});

export const cryptoComExchangeSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.CRYPTO_COM_EXCHANGE),
  filename: z.enum(
    EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.CRYPTO_COM_EXCHANGE]
  ),
});
export const ledgerSchema = baseSchema.extend({
  exchange: z.literal(exchangeEnum.enum.LEDGER),
  filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.LEDGER]),
});
