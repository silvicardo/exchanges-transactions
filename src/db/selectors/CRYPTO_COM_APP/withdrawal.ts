import prisma from "../../../../client";
import { QueryTimespan, queryUtils } from "../utils";

export const getAllFiat = ({
  timestamp,
}: Partial<{
  timestamp: Partial<QueryTimespan>;
}> = {}) => {
  return prisma.cryptoComFiatTransaction.findMany({
    where: {
      currency: "EUR",
      transactionKind: "viban_card_top_up",
      ...(timestamp
        ? { timestampUtc: queryUtils.getTimespanQueryObject(timestamp) }
        : {}),
    },
    orderBy: { timestampUtc: "asc" },
  });
};
