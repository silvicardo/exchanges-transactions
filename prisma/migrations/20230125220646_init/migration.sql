-- CreateEnum
CREATE TYPE "BitpandaProDepositWithdrawType" AS ENUM ('Deposit', 'Withdrawal');

-- CreateEnum
CREATE TYPE "BitpandaProDepositWithdrawInOutType" AS ENUM ('Incoming', 'Outgoing');

-- CreateEnum
CREATE TYPE "BitpandaProDepositWithdrawInternalExternalType" AS ENUM ('Internal', 'External');

-- CreateTable
CREATE TABLE "BitpandaProDepositWithdraw" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "externalTransactionId" TEXT,
    "type" "BitpandaProDepositWithdrawType" NOT NULL,
    "inOut" "BitpandaProDepositWithdrawInOutType" NOT NULL,
    "internalExternal" "BitpandaProDepositWithdrawInternalExternalType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "CurrencyName" NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "timeCreated" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "BitpandaProDepositWithdraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BitpandaProTrade" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "type" "TransactionSide" NOT NULL,
    "market" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountCurrency" "CurrencyName" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceCurrency" "CurrencyName" NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "feeCurrency" "CurrencyName" NOT NULL,
    "timeUtc" TIMESTAMP(3) NOT NULL,
    "bestEurRate" DOUBLE PRECISION,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "BitpandaProTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BitpandaProDepositWithdraw_transactionId_key" ON "BitpandaProDepositWithdraw"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "BitpandaProTrade_orderId_key" ON "BitpandaProTrade"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "BitpandaProTrade_tradeId_key" ON "BitpandaProTrade"("tradeId");
