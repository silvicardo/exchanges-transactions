"use server";

import { validationSchema } from "@/src/app/import/validation";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ImportFieldValues } from "@/src/app/import/form-options";
import fs from "fs";

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
