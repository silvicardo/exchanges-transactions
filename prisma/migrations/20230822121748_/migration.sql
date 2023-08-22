/*
  Warnings:

  - A unique constraint covering the columns `[operationHash]` on the table `LedgerOperation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LedgerOperation_operationHash_key" ON "LedgerOperation"("operationHash");
