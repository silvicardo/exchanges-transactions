import { z } from "zod";
import {
  EXCHANGE_FILENAME_OPTIONS,
  EXCHANGE_OPTIONS,
  YEAR_OPTIONS,
} from "@/src/app/import/form-options";
import { zfd } from "zod-form-data";

const exchangeEnum = z.enum(EXCHANGE_OPTIONS);
export const validationSchema = zfd.formData(
  z.discriminatedUnion("exchange", [
    z.object({
      year: z.enum(YEAR_OPTIONS),
      exchange: z.literal(exchangeEnum.enum.YOUNG_PLATFORM),
      filename: z.enum(
        EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.YOUNG_PLATFORM]
      ),
      file: z.any(),
    }),
    z.object({
      year: z.enum(YEAR_OPTIONS),
      exchange: z.literal(exchangeEnum.enum.BITPANDA),
      filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA]),
      file: z.any(),
    }),
    z.object({
      year: z.enum(YEAR_OPTIONS),
      exchange: z.literal(exchangeEnum.enum.BITPANDA_PRO),
      filename: z.enum(
        EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.BITPANDA_PRO]
      ),
      file: z.any(),
    }),
    z.object({
      year: z.enum(YEAR_OPTIONS),
      exchange: z.literal(exchangeEnum.enum.NEXO),
      filename: z.enum(EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.NEXO]),
      file: z.any(),
    }),
    z.object({
      year: z.enum(YEAR_OPTIONS),
      exchange: z.literal(exchangeEnum.enum.CRYPTO_COM_APP),
      filename: z.enum(
        EXCHANGE_FILENAME_OPTIONS[exchangeEnum.enum.CRYPTO_COM_APP]
      ),
      file: z.any(),
    }),
  ])
);
