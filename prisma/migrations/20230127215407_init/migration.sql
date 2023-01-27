/*
  Warnings:

  - Added the required column `originalData` to the `CryptoComCardTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalData` to the `CryptoComCryptoTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalData` to the `CryptoComFiatTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoComCardTransaction" ADD COLUMN     "originalData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "CryptoComCryptoTransaction" ADD COLUMN     "originalData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "CryptoComFiatTransaction" ADD COLUMN     "originalData" JSONB NOT NULL;
