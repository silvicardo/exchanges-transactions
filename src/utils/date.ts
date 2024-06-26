import { endOfYear, startOfYear } from "date-fns";

export const getYearTimestamp = (year: number) => {
  return {
    gte: startOfYear(new Date(year, 0, 1)),
    lte: endOfYear(new Date(year, 11, 31)),
  };
};

export const getLastYear = () => new Date().getFullYear() - 1;
export const getLastYearTimestamp = () => {
  const lastYear = new Date().getFullYear() - 1;
  return getYearTimestamp(lastYear);
};
