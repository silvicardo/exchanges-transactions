import argv from "process.argv";
import fs from "fs";
import { convertJSONtoCSV } from "../convertJSONtoCSV";

const processArgv = argv(process.argv.slice(2));

interface Config {
  input_path: string;
  output_path: string;
}
const config = processArgv<Config>({
  input_path: "",
  output_path: "",
});

/**
 @example npm run unparse -- --input_path=my/path/in/csv/folder/file.csv --output_path=my/path/in/csv/folder/file.csv
 */
const handle = async () => {
  const jsonData = fs.readFileSync(`./csvs/${config.input_path}`);
  // @ts-ignore
  const data = JSON.parse(jsonData);
  return convertJSONtoCSV(data, config.output_path);
};

handle().then(() => {
  console.log("unparsed");
});
