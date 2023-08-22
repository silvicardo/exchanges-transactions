-- CreateEnum
CREATE TYPE "LedgerOperationType" AS ENUM ('IN', 'OUT', 'FEES', 'NFT_IN');

-- CreateTable
CREATE TABLE "LedgerOperation" (
    "id" SERIAL NOT NULL,
    "operationDate" TIMESTAMP(3) NOT NULL,
    "currencyTicker" "CurrencyName" NOT NULL,
    "operationType" "LedgerOperationType" NOT NULL,
    "operationAmount" TEXT NOT NULL,
    "operationFees" TEXT,
    "operationHash" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountXpub" TEXT NOT NULL,
    "countervalueTicker" "CurrencyName" NOT NULL,
    "countervalueAtOperationDate" DOUBLE PRECISION NOT NULL,
    "countervalueAtCsvExport" DOUBLE PRECISION NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "LedgerOperation_pkey" PRIMARY KEY ("id")
);
