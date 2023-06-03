import { Prisma } from "@prisma/client";
import { convertCSVtoJSON } from "../../../../convertCSVtoJSON";
import prisma from "../../../../client";

export type CsvInput = {
  id: number;
  credit: number;
  debit: number;
  currency: string;
  date: string;
  tx_type: string;
};

export type Parsed = Omit<
  Prisma.YoungPlatformMovementCreateInput,
  "id" | "userAccountId"
>;

const parse = (input: CsvInput): Parsed => {
  const { tx_type: txType, id, ...rest } = input;

  return {
    originalData: JSON.stringify(input),
    moveId: id,
    txType,
    ...rest,
  } as unknown as Parsed;
};

const store = async ({
  parsed,
  userAccountId,
}: {
  parsed: Parsed[];
  userAccountId: number;
}) =>
  Promise.all(
    parsed.map(async ({ originalData, ...movement }) => {
      console.log("adding deposit_withdraw_fee_order moveId", movement.moveId);
      const data = {
        ...movement,
        originalData: [originalData] as Prisma.JsonArray,
        userAccountId: userAccountId,
      };
      await prisma.youngPlatformMovement.upsert({
        where: { moveId: movement.moveId },
        create: data,
        update: data,
      });
      console.log("adding deposit_withdraw_fee_order moveId", movement.moveId);
    })
  );

export const handle = async ({
  year,
  userAccountId,
}: {
  year: "2021" | "2022" | "2023";
  userAccountId: number;
}) => {
  const csvJsonData = await convertCSVtoJSON<CsvInput>(
    `${year}/YOUNG_PLATFORM/deposit_withdraw_fee_order.csv`
  );
  const parsed = csvJsonData.map(parse);

  return store({
    parsed,
    userAccountId,
  });
};
