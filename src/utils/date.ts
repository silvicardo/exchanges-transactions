export const getLastYear = () => new Date().getFullYear() - 1;
export const getLastYearTimestamp = () => {
  const lastYear = new Date().getFullYear() - 1;
  return {
    gte: new Date(lastYear + "-01-01"),
    lte: new Date(`${lastYear}-12-31`),
  };
};
