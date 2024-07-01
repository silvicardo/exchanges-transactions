"use server";
import Papa from "papaparse";

export async function downloadCsvAttempt(formData: FormData) {
  const jsonData = formData.get("jsondata");
  const csvTransformed = Papa.unparse(
    JSON.parse(jsonData as string) as object[],
    {
      header: true,
      delimiter: ",",
      newline: "\n",
    }
  );
  return { data: csvTransformed };
}
