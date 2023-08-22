import { zfd } from "zod-form-data";
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

export const serverValidationSchema = zfd.formData(
  z.discriminatedUnion("exchange", [
    ypSchema.extend({ file: z.instanceof(Blob) }),
    bitpandaSchema.extend({ file: z.instanceof(Blob) }),
    bitpandaProSchema.extend({ file: z.instanceof(Blob) }),
    nexoSchema.extend({ file: z.instanceof(Blob) }),
    cryptoComAppSchema.extend({ file: z.instanceof(Blob) }),
    cryptoComExchangeSchema.extend({ file: z.instanceof(Blob) }),
    ledgerSchema.extend({ file: z.instanceof(Blob) }),
  ])
);
