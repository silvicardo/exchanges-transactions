import { PrismaClient } from "@prisma/client";

export const getAllFiat = (
  prisma: PrismaClient,
  options?: Partial<{
    timestampUtc: Partial<{
      gte: Date;
      lte: Date;
    }>;
  }>
) => {
  return prisma.cryptoComFiatTransaction.findMany({
    where: {
      AND: [
        { currency: "EUR" },
        {
          transactionKind: "viban_card_top_up",
        },
        {
          timestampUtc: {
            gte: new Date(
              options?.timestampUtc?.gte ?? "2021-01-01"
            ).toISOString(),
            lte: new Date(
              options?.timestampUtc?.lte ?? "2022-12-31"
            ).toISOString(),
          },
        },
      ],
    },
    orderBy: { timestampUtc: "asc" },
  });
};
