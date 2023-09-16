-- AlterTable
ALTER TABLE "CoinbaseTransaction" ALTER COLUMN "quantityTransacted" SET DATA TYPE TEXT,
ALTER COLUMN "spotPriceAtTransaction" SET DATA TYPE TEXT,
ALTER COLUMN "subtotal" SET DATA TYPE TEXT,
ALTER COLUMN "totalInclusiveOfFeesAndOrSpread" SET DATA TYPE TEXT,
ALTER COLUMN "feesAndOrSpread" SET DATA TYPE TEXT;
