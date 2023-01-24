import { Prisma } from "@prisma/client";

export type BuySellSwapInput = {
  id: number;
  base: string;
  quote: string;
  amount: number;
  volume: number;
  rate: number;
  brokerage: number;
  brokerage_currency: string;
  side: string;
  date: string;
};

type BuySellSwapOutput = Omit<
  Prisma.YoungPlatformTradeCreateInput,
  "userAccountId"
> & { txnId: number };

export const parseBuySellSwap = (
  input: BuySellSwapInput
): BuySellSwapOutput => {
  const { brokerage_currency: brokerageCurrency, id, ...rest } = input;
  return {
    originalData: JSON.stringify(input),
    brokerageCurrency,
    txnId: id,
    ...rest,
  } as unknown as BuySellSwapOutput;
};
