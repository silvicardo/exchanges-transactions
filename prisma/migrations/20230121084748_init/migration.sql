/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExchangeName" AS ENUM ('YOUNG_PLATFORM', 'CRYPTO_COM_APP', 'CRYPTO_COM_EXCHANGE', 'BITPANDA', 'BITPANDA_PRO', 'NEXO');

-- CreateEnum
CREATE TYPE "TransactionSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "CurrencyName" AS ENUM ('EUR', 'BTC', 'ETH', 'SOL', 'MATIC', 'DOT', 'LINK', 'AVAX', 'AAVE', 'YFI', 'DOGE');

-- CreateEnum
CREATE TYPE "CurrencyTypology" AS ENUM ('CRYPTO', 'FIAT');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "exchangeUserId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" SERIAL NOT NULL,
    "name" "ExchangeName" NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "name" "CurrencyName" NOT NULL,
    "typology" "CurrencyTypology" NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoungTransaction" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "txnId" INTEGER NOT NULL,
    "base" "CurrencyName" NOT NULL,
    "quote" "CurrencyName" NOT NULL,
    "amount" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "brokerage" DOUBLE PRECISION NOT NULL,
    "brokerageCurrency" DOUBLE PRECISION NOT NULL,
    "side" "TransactionSide" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "originalData" JSONB NOT NULL,

    CONSTRAINT "YoungTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_fullName_key" ON "User"("fullName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
