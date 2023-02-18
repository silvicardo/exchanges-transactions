import fs from "fs";
import Papa from "papaparse";

export const convertJSONtoCSV = async <T extends object[]>(
  data: T,
  filePath: string
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const csv = Papa.unparse(data, {
      header: true,
      delimiter: ",",
      newline: "\n",
    });
    const path = `./csvs/${filePath}`;
    fs.writeFile(path, csv, (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log("CSV file saved at " + path);
      return resolve(data);
    });
  });
};
