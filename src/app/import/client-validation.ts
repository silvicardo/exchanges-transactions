import { z } from "zod";
import {
  bitpandaProSchema,
  bitpandaSchema,
  cryptoComAppSchema,
  cryptoComExchangeSchema,
  ledgerSchema,
  nexoSchema,
  ypSchema,
} from "@/src/app/import/validation";

export const clientValidationSchema = z.discriminatedUnion("exchange", [
  ypSchema.extend({ file: z.instanceof(File) }),
  bitpandaSchema.extend({ file: z.instanceof(File) }),
  bitpandaProSchema.extend({ file: z.instanceof(File) }),
  nexoSchema.extend({ file: z.instanceof(File) }),
  cryptoComAppSchema.extend({ file: z.instanceof(File) }),
  cryptoComExchangeSchema.extend({ file: z.instanceof(File) }),
  ledgerSchema.extend({ file: z.instanceof(File) }),
]);
