-- CreateEnum
CREATE TYPE "CryptoComExchangeDustConversionType" AS ENUM ('DUST_CONVERSION');

-- CreateEnum
CREATE TYPE "CryptoComExchangeDustConversionStatus" AS ENUM ('COMPLETED');

-- CreateTable
CREATE TABLE "CryptoComExchangeDustConversions" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "accountUuid" TEXT NOT NULL,
    "conversionId" TEXT NOT NULL,
    "conversionType" "CryptoComExchangeDustConversionType" NOT NULL,
    "status" "CryptoComExchangeDustConversionStatus" NOT NULL,
    "dustCurrency" "CurrencyName" NOT NULL,
    "dustAmount" TEXT NOT NULL,
    "toCurrency" "CurrencyName" NOT NULL,
    "toAmount" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "CryptoComExchangeDustConversions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComExchangeDustConversions_conversionId_key" ON "CryptoComExchangeDustConversions"("conversionId");
