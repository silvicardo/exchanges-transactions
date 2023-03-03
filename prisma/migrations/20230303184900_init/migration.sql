-- CreateEnum
CREATE TYPE "CryptoComExchangeTransactionType" AS ENUM ('EXCHANGE', 'SEND');

-- CreateEnum
CREATE TYPE "CryptoComExchangeTransactionTag" AS ENUM ('UNCATEGORIZED', 'TRADE');

-- CreateTable
CREATE TABLE "CryptoComExchangeTransaction" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "transactionTime" TIMESTAMP(3) NOT NULL,
    "transactionType" "CryptoComExchangeTransactionType" NOT NULL,
    "receiveCurrency" "CurrencyName",
    "receiveAmount" DOUBLE PRECISION,
    "receiveWallet" TEXT,
    "receiveAddress" TEXT,
    "receiveTag" "CryptoComExchangeTransactionTag",
    "sendCurrency" "CurrencyName",
    "sendAmount" DOUBLE PRECISION,
    "sendWallet" TEXT,
    "sendAddress" TEXT,
    "sendTag" "CryptoComExchangeTransactionTag",
    "feeCurrency" "CurrencyName",
    "feeAmount" DOUBLE PRECISION,
    "comment" TEXT,
    "sendWorth" DOUBLE PRECISION NOT NULL,
    "receiveWorth" DOUBLE PRECISION NOT NULL,
    "feeWorth" DOUBLE PRECISION NOT NULL,
    "receiveGain" DOUBLE PRECISION,
    "ignored" BOOLEAN NOT NULL DEFAULT false,
    "transactionUrl" TEXT,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "CryptoComExchangeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComExchangeTransaction_transactionId_key" ON "CryptoComExchangeTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComExchangeTransaction_transactionTime_key" ON "CryptoComExchangeTransaction"("transactionTime");
