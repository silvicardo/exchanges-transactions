/*
  Warnings:

  - A unique constraint covering the columns `[txnId]` on the table `YoungTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "YoungTransaction_txnId_key" ON "YoungTransaction"("txnId");
