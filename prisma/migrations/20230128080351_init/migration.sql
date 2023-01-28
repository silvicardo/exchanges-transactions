/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `NexoTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `NexoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NexoTransaction" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NexoTransaction_transactionId_key" ON "NexoTransaction"("transactionId");
