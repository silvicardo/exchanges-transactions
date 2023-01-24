/*
  Warnings:

  - Changed the type of `amount` on the `YoungTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `brokerageCurrency` on the `YoungTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "YoungTransaction" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "brokerageCurrency",
ADD COLUMN     "brokerageCurrency" "CurrencyName" NOT NULL;
