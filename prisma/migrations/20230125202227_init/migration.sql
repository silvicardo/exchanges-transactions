-- CreateEnum
CREATE TYPE "BitpandaTxnType" AS ENUM ('deposit', 'buy', 'sell', 'withdrawal', 'transfer');

-- CreateEnum
CREATE TYPE "BitpandaInOutType" AS ENUM ('incoming', 'outgoing');

-- CreateEnum
CREATE TYPE "BitpandaAssetClass" AS ENUM ('Fiat', 'Cryptocurrency');

-- CreateEnum
CREATE TYPE "BitpandaSupportedFiats" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "BitpandaFeeCurrencyName" AS ENUM ('EUR', 'BEST');

-- CreateTable
CREATE TABLE "BitpandaTrade" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionType" "BitpandaTxnType" NOT NULL,
    "inOut" "BitpandaInOutType" NOT NULL,
    "amountFiat" DOUBLE PRECISION NOT NULL,
    "fiat" "BitpandaSupportedFiats" NOT NULL,
    "amountAsset" DOUBLE PRECISION,
    "asset" "CurrencyName" NOT NULL,
    "assetMarketPrice" DOUBLE PRECISION,
    "assetMarketPriceCurrency" "BitpandaSupportedFiats",
    "assetClass" "BitpandaAssetClass" NOT NULL,
    "productID" INTEGER,
    "fee" DOUBLE PRECISION,
    "feeAsset" "BitpandaFeeCurrencyName",
    "spread" DOUBLE PRECISION,
    "spreadCurrency" "CurrencyName",

    CONSTRAINT "BitpandaTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BitpandaTrade_transactionId_key" ON "BitpandaTrade"("transactionId");
