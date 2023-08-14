export const getYearTimestamp = (year: number) => {
  return {
    gte: new Date(`${year}-01-01`),
    lte: new Date(`${year}-12-31`),
  };
};

export const getLastYear = () => new Date().getFullYear() - 1;
export const getLastYearTimestamp = () => {
  const lastYear = new Date().getFullYear() - 1;
  return getYearTimestamp(lastYear);
};
