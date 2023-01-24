-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CurrencyName" ADD VALUE 'BCH';
ALTER TYPE "CurrencyName" ADD VALUE 'LTC';
ALTER TYPE "CurrencyName" ADD VALUE 'XLM';
ALTER TYPE "CurrencyName" ADD VALUE 'XRP';
ALTER TYPE "CurrencyName" ADD VALUE 'DASH';
ALTER TYPE "CurrencyName" ADD VALUE 'EOS';
ALTER TYPE "CurrencyName" ADD VALUE 'XTZ';
ALTER TYPE "CurrencyName" ADD VALUE 'UNI';
ALTER TYPE "CurrencyName" ADD VALUE 'BAT';
ALTER TYPE "CurrencyName" ADD VALUE 'ADA';
ALTER TYPE "CurrencyName" ADD VALUE 'LUNA';
ALTER TYPE "CurrencyName" ADD VALUE 'REPV2';
ALTER TYPE "CurrencyName" ADD VALUE 'USDT';
ALTER TYPE "CurrencyName" ADD VALUE 'USDC';
ALTER TYPE "CurrencyName" ADD VALUE 'KNC';
ALTER TYPE "CurrencyName" ADD VALUE 'MKR';
ALTER TYPE "CurrencyName" ADD VALUE 'SUSHI';
ALTER TYPE "CurrencyName" ADD VALUE 'SNX';
ALTER TYPE "CurrencyName" ADD VALUE 'SAND';
ALTER TYPE "CurrencyName" ADD VALUE 'MANA';
ALTER TYPE "CurrencyName" ADD VALUE 'ENJ';
ALTER TYPE "CurrencyName" ADD VALUE 'CRO';
ALTER TYPE "CurrencyName" ADD VALUE 'UMA';
ALTER TYPE "CurrencyName" ADD VALUE 'CHR';
ALTER TYPE "CurrencyName" ADD VALUE 'VET';
ALTER TYPE "CurrencyName" ADD VALUE 'GALA';
ALTER TYPE "CurrencyName" ADD VALUE 'EGLD';
ALTER TYPE "CurrencyName" ADD VALUE 'SHIB';
ALTER TYPE "CurrencyName" ADD VALUE 'ALGO';
ALTER TYPE "CurrencyName" ADD VALUE 'AXS';
ALTER TYPE "CurrencyName" ADD VALUE 'ONE';
ALTER TYPE "CurrencyName" ADD VALUE 'ELON';
ALTER TYPE "CurrencyName" ADD VALUE 'KDA';
ALTER TYPE "CurrencyName" ADD VALUE 'THETA';
ALTER TYPE "CurrencyName" ADD VALUE 'ATOM';
ALTER TYPE "CurrencyName" ADD VALUE 'NEXO';
ALTER TYPE "CurrencyName" ADD VALUE 'EURX';
ALTER TYPE "CurrencyName" ADD VALUE 'BEST';
ALTER TYPE "CurrencyName" ADD VALUE 'FIL';
ALTER TYPE "CurrencyName" ADD VALUE 'TRX';
ALTER TYPE "CurrencyName" ADD VALUE 'ICP';
ALTER TYPE "CurrencyName" ADD VALUE 'BNB';
ALTER TYPE "CurrencyName" ADD VALUE 'FTT';
ALTER TYPE "CurrencyName" ADD VALUE 'FTM';
