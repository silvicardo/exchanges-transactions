-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CurrencyName" ADD VALUE 'SBTC';
ALTER TYPE "CurrencyName" ADD VALUE 'SETH';
ALTER TYPE "CurrencyName" ADD VALUE 'SAAVE';
ALTER TYPE "CurrencyName" ADD VALUE 'SLINK';
ALTER TYPE "CurrencyName" ADD VALUE 'SAVAX';
ALTER TYPE "CurrencyName" ADD VALUE 'SSOL';
ALTER TYPE "CurrencyName" ADD VALUE 'SDOGE';
ALTER TYPE "CurrencyName" ADD VALUE 'SMATIC';
ALTER TYPE "CurrencyName" ADD VALUE 'SDOT';
ALTER TYPE "CurrencyName" ADD VALUE 'SFTM';
