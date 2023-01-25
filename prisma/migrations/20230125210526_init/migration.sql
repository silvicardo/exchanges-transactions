/*
  Warnings:

  - You are about to drop the column `productID` on the `BitpandaTrade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BitpandaTrade" DROP COLUMN "productID",
ADD COLUMN     "productId" INTEGER;
