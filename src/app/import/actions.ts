"use server";

import { serverValidationSchema } from "@/src/app/import/server-validation";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ImportFieldValues } from "@/src/app/import/form-options";
import fs from "fs";
import { camelCase } from "lodash";
import { database } from "@/src/db";
const FAKE_USER_ACCOUNT_ID = 1234;
export const importExchangeData = async (exchangeData: FormData) => {
  const validationResult = serverValidationSchema.safeParse(exchangeData);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message ?? "validation failed",
    };
  }
  const { year, filename, exchange, file } = validationResult.data;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join(
    process.cwd(),
    "/",
    "csvs",
    "/",
    year,
    "/",
    exchange,
    "/",
    `${filename}.csv`
  );
  try {
    await writeFile(path, buffer);
  } catch (e) {
    return {
      success: false,
      error: `unable write file to path: ${path}`,
    };
  }

  const handlerFolder = camelCase(exchange) as keyof typeof database.handlers;

  if (!database.handlers.hasOwnProperty(handlerFolder)) {
    return {
      success: false,
      error: "file written but no handler found for that exchange",
    };
  }
  if (!database.handlers[handlerFolder].hasOwnProperty(filename)) {
    return {
      success: false,
      error: "file written but no handler found for that exchange",
    };
  }
  try {
    switch (exchange) {
      case "YOUNG_PLATFORM":
        if (database.handlers.youngPlatform.hasOwnProperty(filename)) {
          await database.handlers.youngPlatform[
            filename as keyof typeof database.handlers.youngPlatform
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      case "BITPANDA":
        if (database.handlers.bitpandaPro.hasOwnProperty(filename)) {
          await database.handlers.bitpandaPro[
            filename as keyof typeof database.handlers.bitpandaPro
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      case "BITPANDA_PRO":
        if (database.handlers.bitpandaPro.hasOwnProperty(filename)) {
          await database.handlers.bitpandaPro[
            filename as keyof typeof database.handlers.bitpandaPro
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      case "NEXO":
        if (database.handlers.nexo.hasOwnProperty(filename)) {
          await database.handlers.nexo[
            filename as keyof typeof database.handlers.nexo
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      case "CRYPTO_COM_APP":
        if (database.handlers.cryptoComApp.hasOwnProperty(filename)) {
          await database.handlers.cryptoComApp[
            filename as keyof typeof database.handlers.cryptoComApp
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      case "LEDGER":
        if (database.handlers.ledger.hasOwnProperty(filename)) {
          await database.handlers.ledger[
            filename as keyof typeof database.handlers.ledger
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;

      case "CRYPTO_COM_EXCHANGE":
        if (database.handlers.cryptoComExchange.hasOwnProperty(filename)) {
          await database.handlers.cryptoComExchange[
            filename as keyof typeof database.handlers.cryptoComExchange
          ]({
            year,
            userAccountId: FAKE_USER_ACCOUNT_ID,
          });
        }
        break;
      default:
        return {
          success: false,
          error: "file written but no handler found for that exchange",
        };
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: "file written but handler failed",
    };
  }

  return {
    success: true,
    message: `open ${path} to see the uploaded file`,
  };
};

const getFiles = (dir: fs.PathLike, files: string[] = []) => {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(name);
    }
  }
  return files;
};

export const hasCsvFile = async ({
  exchange,
  filename,
  year,
}: Omit<ImportFieldValues, "file">) => {
  const path = `/csvs/${year}/${exchange}`;
  const fullPath = `${process.cwd()}${path}`;
  const filesForConfig = getFiles(fullPath);
  return {
    success: true,
    path: `${path}/${filename}.csv`,
    hasFoundMatch: filesForConfig.some((f) => f.includes(filename)),
  };
};
