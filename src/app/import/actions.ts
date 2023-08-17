"use server";
import { ImportFieldValues } from "@/src/app/import/form-options";
import { validationSchema } from "@/src/app/import/validation";

export const importExchangeData = async (exchangeData: ImportFieldValues) => {
  const validationResult = validationSchema.safeParse(exchangeData);
  if (validationResult.success) {
    return {
      success: true,
    };
  }
  return {
    success: false,
    error: validationResult.error.errors[0].message ?? "something is wrong",
  };
};
