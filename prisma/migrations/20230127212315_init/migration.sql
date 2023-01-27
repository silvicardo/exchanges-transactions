/*
  Warnings:

  - A unique constraint covering the columns `[timestampUtc]` on the table `CryptoComCardTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[timestampUtc]` on the table `CryptoComCryptoTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[timestampUtc]` on the table `CryptoComFiatTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CryptoComCardTransaction_timestampUtc_key" ON "CryptoComCardTransaction"("timestampUtc");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComCryptoTransaction_timestampUtc_key" ON "CryptoComCryptoTransaction"("timestampUtc");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoComFiatTransaction_timestampUtc_key" ON "CryptoComFiatTransaction"("timestampUtc");
