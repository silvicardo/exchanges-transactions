import {
  Prisma,
  CurrencyName,
  CryptoComExchangeDustConversionType,
  CryptoComExchangeDustConversionStatus,
} from "@prisma/client";
import { convertCSVtoJSON } from "@/convertCSVtoJSON";
import prisma from "@/client";

type CsvInput = {
  account_uuid: string;
  conversion_id: string;
  conversion_type: CryptoComExchangeDustConversionType;
  status: CryptoComExchangeDustConversionStatus;
  dust_currency: CurrencyName;
  dust_amount: string;
  to_currency: CurrencyName;
  to_amount: string;
  create_time: number;
  update_time: number;
};

type Parsed = Omit<
  Prisma.CryptoComExchangeDustConversionCreateInput,
  "id" | "userAccountId" | "originalData"
> & {
  originalData: string;
};

const parse = (input: CsvInput): Parsed => {
  const {
    account_uuid: accountUuid,
    conversion_id: conversionId,
    conversion_type: conversionType,
    status,
    dust_currency: dustCurrency,
    dust_amount: dustAmount,
    to_currency: toCurrency,
    to_amount: toAmount,
    create_time: createTime,
    update_time: updateTime,
  } = input;
  return {
    accountUuid,
    conversionId,
    conversionType,
    status,
    dustCurrency,
    dustAmount: String(dustAmount),
    toCurrency,
    toAmount: String(toAmount),
    createTime: new Date(createTime).toISOString(),
    updateTime: new Date(updateTime).toISOString(),
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
    parsed.map(async ({ originalData, ...conv }) => {
      console.log(
        "Adding CryptoComExchangeDustConversion > conversionId",
        conv.conversionId
      );
      const data = {
        ...conv,
        userAccountId,
        originalData: [originalData] as Prisma.JsonArray,
      };
      await prisma.cryptoComExchangeDustConversion.upsert({
        where: {
          conversionId: conv.conversionId,
        },
        create: data,
        update: data,
      });
      console.log(
        "added CryptoComExchangeDustConversion > conversionId",
        conv.conversionId
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
    `${year}/CRYPTO_COM_EXCHANGE/dust_conversions.csv`
  );
  const parsed = csvJsonData.map(parse);
  return store({
    parsed,
    userAccountId,
  });
};
