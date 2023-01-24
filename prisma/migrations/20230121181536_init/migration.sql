/*
  Warnings:

  - You are about to drop the `YoungTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "YoungTransaction";

-- CreateTable
CREATE TABLE "YoungPlatformTrade" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "txnId" INTEGER NOT NULL,
    "base" "CurrencyName" NOT NULL,
    "quote" "CurrencyName" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "brokerage" DOUBLE PRECISION NOT NULL,
    "brokerageCurrency" "CurrencyName" NOT NULL,
    "side" "TransactionSide" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "YoungPlatformTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YoungPlatformTrade_txnId_key" ON "YoungPlatformTrade"("txnId");
