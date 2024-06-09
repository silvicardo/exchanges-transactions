import { convertCSVtoJSON } from "../../../../convertCSVtoJSON";
import {
  Prisma,
  CurrencyName,
  CryptoComCryptoTransactionKind,
} from "@prisma/client";
import prisma from "../../../../client";

type CsvInput = {
  "Timestamp (UTC)": string;
  "Transaction Description": string;
  Currency: CurrencyName;
  Amount: number;
  "To Currency"?: CurrencyName;
  "To Amount"?: number;
  "Native Currency": CurrencyName;
  "Native Amount": number;
  "Native Amount (in USD)": number;
  "Transaction Kind": CryptoComCryptoTransactionKind;
  "Transaction Hash"?: string;
};

type Parsed = Omit<
  Prisma.CryptoComCryptoTransactionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    "Timestamp (UTC)": timestampUtc,
    "Transaction Description": transactionDescription,
    Currency: currency,
    Amount: amount,
    "To Currency": toCurrency,
    "To Amount": toAmount,
    "Native Currency": nativeCurrency,
    "Native Amount": nativeAmount,
    "Native Amount (in USD)": nativeAmountInUsd,
    "Transaction Kind": transactionKind,
    "Transaction Hash": transactionHash,
  } = input;

  return {
    timestampUtc,
    transactionDescription,
    currency,
    amount,
    toCurrency,
    toAmount,
    nativeCurrency,
    nativeAmount,
    nativeAmountInUsd,
    transactionKind,
    transactionHash,
    originalData: JSON.stringify(input),
  };
};

const store = async ({
  parsed,
  userAccountId,
}: {
  parsed: Parsed[];
  userAccountId: number;
}) => {
  //TODO:: should be batched but got to find a way to fix postgres count issue
  for (let i = 0; i < parsed.length; i++) {
    const { originalData, ...trans } = parsed[i];

    const timestampUtc = new Date(trans.timestampUtc).toISOString();
    const data = {
      ...trans,
      timestampUtc,
      originalData: [originalData] as Prisma.JsonArray,
      userAccountId: userAccountId,
    };
    const result = await prisma.cryptoComCryptoTransaction.findFirst({
      where: {
        AND: [
          { timestampUtc: timestampUtc },
          { currency: trans.currency },
          { transactionKind: trans.transactionKind },
        ],
      },
    });

    if (result) {
      console.log(
        "Updating CryptoComApp crypto transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription} > id: ${result.id}`
      );
      await prisma.cryptoComCryptoTransaction.update({
        where: { id: result.id },
        data: data,
      });
    } else {
      //this picks the highest id and increments it by 1
      const {
        _max: { id: maxId },
      } = await prisma.cryptoComCryptoTransaction.aggregate({
        _max: { id: true },
      });

      console.log(
        "Create Attempt CryptoComApp crypto transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription} ${trans.amount}`
      );
      const { id } = await prisma.cryptoComCryptoTransaction.create({
        data: { ...data, id: (maxId ?? 0) + 1 },
      });
      console.log(
        "Created CryptoComApp crypto transaction > txn",
        `${trans.transactionKind} ${trans.transactionDescription} > id: ${id}`
      );
    }
  }
  return;
};

export const handle = async ({
  year,
  userAccountId,
}: {
  year: "2021" | "2022" | "2023";
  userAccountId: number;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/CRYPTO_COM_APP/crypto_transactions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
