import {
  PrismaClient,
  PrismaPromise,
  CryptoComExchangeTransaction,
} from "@prisma/client";

type RequiredPick<T extends keyof CryptoComExchangeTransaction> = Record<
  T,
  NonNullable<CryptoComExchangeTransaction[T]>
>;

export type CryptoComExchangeTradeTransaction = Omit<
  CryptoComExchangeTransaction,
  | "transactionType"
  | "sendAmount"
  | "sendCurrency"
  | "receiveAmount"
  | "receiveCurrency"
  | "feeAmount"
  | "feeCurrency"
> & {
  transactionType: "EXCHANGE";
} & RequiredPick<"sendAmount"> &
  RequiredPick<"sendCurrency"> &
  RequiredPick<"receiveAmount"> &
  RequiredPick<"receiveCurrency"> &
  RequiredPick<"feeAmount"> &
  RequiredPick<"feeCurrency">;

export const getAll = (
  prisma: PrismaClient
): Promise<CryptoComExchangeTradeTransaction[]> => {
  return prisma.cryptoComExchangeTransaction.findMany({
    where: { transactionType: "EXCHANGE" },
  }) as PrismaPromise<CryptoComExchangeTradeTransaction[]>;
};
