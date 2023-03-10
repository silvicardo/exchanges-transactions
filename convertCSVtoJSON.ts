import fs from "fs";
import Papa from "papaparse";

export const convertCSVtoJSON = <T extends object>(
  filePath: string
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./csvs/${filePath}`, "utf-8", (err, fileData) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = Papa.parse<T>(fileData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        resolve(jsonData.data);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};
