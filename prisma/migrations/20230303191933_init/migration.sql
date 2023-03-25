/*
  Warnings:

  - Added the required column `userAccountId` to the `CryptoComExchangeTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoComExchangeTransaction" ADD COLUMN     "userAccountId" INTEGER NOT NULL;
