import { Prisma } from "@prisma/client";

type DateArg = ConstructorParameters<typeof Date>[0];

export type QueryTimespan = {
  gte: DateArg;
  lte: DateArg;
};
const getTimespanQueryObject = (
  dates: Partial<QueryTimespan> = {}
): Pick<Prisma.DateTimeFilter, "gte" | "lte"> => {
  return {
    gte: new Date(dates.gte ?? "2021-01-01").toISOString(),
    lte: new Date(dates.lte ?? "2022-12-31").toISOString(),
  };
};

export const queryUtils = {
  getTimespanQueryObject,
};
