import argv from "process.argv";
import { convertCSVtoJSON } from "../convertCSVtoJSON";

const processArgv = argv(process.argv.slice(2));

interface Config {
  path: string;
}
const config = processArgv<Config>({
  path: "",
});

/**
 @example npm run parse -- --path=my/path/in/csv/folder/file.csv
 */
convertCSVtoJSON(config.path)
  .then((jsonData) => {
    console.log(jsonData);
  })
  .catch((err) => {
    console.error(err);
  });
