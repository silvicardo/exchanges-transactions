import { CurrencyName, LedgerOperationType, Prisma } from "@prisma/client";
import prisma from "@/client";
import { convertCSVtoJSON } from "@/convertCSVtoJSON";

type CsvInput = {
  "Operation Date": string;
  "Currency Ticker": CurrencyName;
  "Operation Type": LedgerOperationType;
  "Operation Amount": number;
  "Operation Fees"?: number;
  "Operation Hash": string;
  "Account Name": string;
  "Account xpub": string;
  "Countervalue Ticker": CurrencyName;
  "Countervalue at Operation Date": number;
  "Countervalue at CSV Export": number;
};

type Parsed = Omit<
  Prisma.LedgerOperationCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    "Operation Date": operationDate,
    "Currency Ticker": currencyTicker,
    "Operation Type": operationType,
    "Operation Amount": operationAmount,
    "Operation Fees": operationFees,
    "Operation Hash": operationHash,
    "Account Name": accountName,
    "Account xpub": accountXpub,
    "Countervalue Ticker": countervalueTicker,
    "Countervalue at Operation Date": countervalueAtOperationDate,
    "Countervalue at CSV Export": countervalueAtCsvExport,
  } = input;

  return {
    operationDate: new Date(operationDate).toISOString(),
    currencyTicker,
    operationType,
    operationAmount: String(operationAmount),
    operationFees: String(operationFees),
    operationHash,
    accountName,
    accountXpub,
    countervalueTicker,
    countervalueAtOperationDate,
    countervalueAtCsvExport,
    originalData: JSON.stringify(input),
  };
};

const store = async ({
  parsed,
  userAccountId,
}: {
  parsed: Parsed[];
  userAccountId: number;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...trans }) => {
      console.log(
        "Adding Ledger Operation > operationHash",
        trans.operationHash
      );
      const data = {
        ...trans,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.ledgerOperation.upsert({
        where: {
          operationHash: trans.operationHash,
        },
        create: data,
        update: data,
      });
      console.log(
        "added Ledger Operation > operationHash",
        trans.operationHash
      );
    })
  );

export const handle = async ({
  userAccountId,
  year,
}: {
  userAccountId: number;
  year: "2021" | "2022" | "2023";
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/LEDGER/operations.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
