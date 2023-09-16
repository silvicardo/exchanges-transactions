/*
  Warnings:

  - A unique constraint covering the columns `[timestamp]` on the table `CoinbaseTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoinbaseTransaction_timestamp_key" ON "CoinbaseTransaction"("timestamp");
