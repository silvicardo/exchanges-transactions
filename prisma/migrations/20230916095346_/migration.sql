/*
  Warnings:

  - Added the required column `originalData` to the `CoinbaseTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoinbaseTransaction" ADD COLUMN     "originalData" JSONB NOT NULL;
