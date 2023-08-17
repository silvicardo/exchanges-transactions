import { z } from "zod";
import {
  EXCHANGE_FILENAME_OPTIONS,
  EXCHANGE_OPTIONS,
  YEAR_OPTIONS,
} from "@/src/app/import/form-options";

const exchangeEnum = z.enum(EXCHANGE_OPTIONS);
export const validationSchema = z.discriminatedUnion("exchange", [
  z.object({
    year: z.enum(YEAR_OPTIONS),
    exchange: z.literal(exchangeEnum.enum.YOUNG_PLATFORM),
    filename: z.enum(
      EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.YOUNG_PLATFORM]
    ),
  }),
  z.object({
    year: z.enum(YEAR_OPTIONS),
    exchange: z.literal(exchangeEnum.enum.BITPANDA),
    filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA]),
  }),
  z.object({
    year: z.enum(YEAR_OPTIONS),
    exchange: z.literal(exchangeEnum.enum.BITPANDA_PRO),
    filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA_PRO]),
  }),
  z.object({
    year: z.enum(YEAR_OPTIONS),
    exchange: z.literal(exchangeEnum.enum.NEXO),
    filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.NEXO]),
  }),
  z.object({
    year: z.enum(YEAR_OPTIONS),
    exchange: z.literal(exchangeEnum.enum.CRYPTO_COM_APP),
    filename: z.enum(
      EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.CRYPTO_COM_APP]
    ),
  }),
]);

export type ImportDataSchemaType = z.infer<typeof validationSchema>;
