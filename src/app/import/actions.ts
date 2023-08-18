"use server";

import { validationSchema } from "@/src/app/import/validation";
import { writeFile } from "fs/promises";
import { join } from "path";

export const importExchangeData = async (exchangeData: FormData) => {
  const validationResult = validationSchema.safeParse(exchangeData);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message ?? "validation failed",
    };
  }
  const file = validationResult.data.file as unknown as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join(
    process.cwd(),
    "/",
    "csvs",
    "/",
    validationResult.data.year,
    "/",
    validationResult.data.exchange,
    "/",
    `${validationResult.data.filename}.csv`
  );
  try {
    await writeFile(path, buffer);
  } catch (e) {
    return {
      success: false,
      error: `unable write file to path: ${path}`,
    };
  }

  return {
    success: true,
    message: `open ${path} to see the uploaded file`,
  };
};
