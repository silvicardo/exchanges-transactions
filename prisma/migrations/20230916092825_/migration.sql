-- CreateEnum
CREATE TYPE "CoinbaseTransactionType" AS ENUM ('Buy', 'Sell', 'Learning_Reward', 'Rewards_Income');

-- CreateTable
CREATE TABLE "CoinbaseTransaction" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionType" "CoinbaseTransactionType" NOT NULL,
    "asset" "CurrencyName" NOT NULL,
    "quantityTransacted" DOUBLE PRECISION NOT NULL,
    "spotPriceCurrency" "CurrencyName" NOT NULL,
    "spotPriceAtTransaction" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "totalInclusiveOfFeesAndOrSpread" DOUBLE PRECISION NOT NULL,
    "feesAndOrSpread" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "CoinbaseTransaction_pkey" PRIMARY KEY ("id")
);
