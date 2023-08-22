/*
  Warnings:

  - You are about to drop the `CryptoComExchangeDustConversions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CryptoComExchangeDustConversions";

-- CreateTable
CREATE TABLE "CryptoComExchangeDustConversion" (
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

    CONSTRAINT "CryptoComExchangeDustConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComExchangeDustConversion_conversionId_key" ON "CryptoComExchangeDustConversion"("conversionId");
