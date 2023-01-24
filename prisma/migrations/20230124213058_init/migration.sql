-- CreateEnum
CREATE TYPE "YPTxType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'ORDER_PLACEMENT', 'ORDER_MATCHED', 'ORDER_CANCELLED', 'REFERRAL', 'ADMIN', 'FEE', 'STAKING_TRANSACTION', 'STAKING_REWARD');

-- CreateTable
CREATE TABLE "YoungPlatformMovement" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "currency" "CurrencyName" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "txType" "YPTxType" NOT NULL,

    CONSTRAINT "YoungPlatformMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YoungPlatformMovement_moveId_key" ON "YoungPlatformMovement"("moveId");
