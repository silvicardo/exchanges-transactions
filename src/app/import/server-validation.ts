import { zfd } from "zod-form-data";
import { z } from "zod";
import {
  bitpandaProSchema,
  bitpandaSchema,
  coinbaseSchema,
  cryptoComAppSchema,
  cryptoComExchangeSchema,
  ledgerSchema, nexoProSchema,
  nexoSchema,
  ypSchema
} from "@/src/app/import/validation";

export const serverValidationSchema = zfd.formData(
  z.discriminatedUnion("exchange", [
    ypSchema.extend({ file: z.instanceof(Blob) }),
    bitpandaSchema.extend({ file: z.instanceof(Blob) }),
    bitpandaProSchema.extend({ file: z.instanceof(Blob) }),
    nexoSchema.extend({ file: z.instanceof(Blob) }),
    nexoProSchema.extend({ file: z.instanceof(Blob) }),
    cryptoComAppSchema.extend({ file: z.instanceof(Blob) }),
    cryptoComExchangeSchema.extend({ file: z.instanceof(Blob) }),
    ledgerSchema.extend({ file: z.instanceof(Blob) }),
    coinbaseSchema.extend({ file: z.instanceof(Blob) }),
  ])
);
