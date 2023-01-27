-- CreateEnum
CREATE TYPE "CryptoComFiatTransactionKind" AS ENUM ('viban_card_top_up', 'viban_deposit', 'viban_purchase', 'crypto_viban');

-- CreateEnum
CREATE TYPE "CryptoComCryptoTransactionKind" AS ENUM ('referral_card_cashback', 'viban_purchase', 'crypto_earn_program_created', 'crypto_earn_interest_paid', 'crypto_earn_program_withdrawn', 'exchange_to_crypto_transfer', 'crypto_to_exchange_transfer', 'supercharger_deposit', 'supercharger_reward_to_app_credited', 'crypto_exchange', 'crypto_purchase', 'dust_conversion_credited', 'crypto_deposit', 'rewards_platform_deposit_credited', 'referral_gift', 'referral_bonus', 'lockup_lock');

-- CreateEnum
CREATE TYPE "CryptoComCardCurrency" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "NexoTransactionType" AS ENUM ('Deposit', 'LockingTermDeposit', 'Exchange', 'DepositToExchange', 'ExchangeDepositedOn', 'ExchangeCashback', 'UnlockingTermDeposit', 'Interest', 'FixedTermInterest', 'TransferOut', 'TransferIn', 'CreditCardStatus', 'Cashback', 'Liquidation', 'Repayment', 'Withdrawal', 'Administrator');

-- AlterEnum
ALTER TYPE "CurrencyName" ADD VALUE 'APE';

-- CreateTable
CREATE TABLE "CryptoComFiatTransaction" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "timestampUtc" TIMESTAMP(3) NOT NULL,
    "transactionDescription" TEXT NOT NULL,
    "currency" "CurrencyName" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "toCurrency" "CurrencyName" NOT NULL,
    "toAmount" DOUBLE PRECISION NOT NULL,
    "nativeCurrency" "CurrencyName" NOT NULL,
    "nativeAmount" DOUBLE PRECISION NOT NULL,
    "nativeAmountInUsd" DOUBLE PRECISION NOT NULL,
    "transactionKind" "CryptoComFiatTransactionKind" NOT NULL,
    "transactionHash" TEXT,

    CONSTRAINT "CryptoComFiatTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoComCryptoTransaction" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "timestampUtc" TIMESTAMP(3) NOT NULL,
    "transactionDescription" TEXT NOT NULL,
    "currency" "CurrencyName" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "toCurrency" "CurrencyName",
    "toAmount" DOUBLE PRECISION,
    "nativeCurrency" "CurrencyName" NOT NULL,
    "nativeAmount" DOUBLE PRECISION NOT NULL,
    "nativeAmountInUsd" DOUBLE PRECISION NOT NULL,
    "transactionKind" "CryptoComCryptoTransactionKind" NOT NULL,
    "transactionHash" TEXT,

    CONSTRAINT "CryptoComCryptoTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoComCardTransaction" (
    "id" SERIAL NOT NULL,
    "userAccountId" INTEGER NOT NULL,
    "timestampUtc" TIMESTAMP(3) NOT NULL,
    "transactionDescription" TEXT NOT NULL,
    "currency" "CryptoComCardCurrency" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "toCurrency" "CryptoComCardCurrency",
    "toAmount" DOUBLE PRECISION,
    "nativeCurrency" "CurrencyName" NOT NULL,
    "nativeAmount" DOUBLE PRECISION NOT NULL,
    "nativeAmountInUsd" DOUBLE PRECISION NOT NULL,
    "transactionKind" TEXT,
    "transactionHash" TEXT,

    CONSTRAINT "CryptoComCardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NexoTransaction" (
    "id" SERIAL NOT NULL,
    "type" "NexoTransactionType" NOT NULL,
    "inputCurrency" "CurrencyName" NOT NULL,
    "inputAmount" DOUBLE PRECISION NOT NULL,
    "outputCurrency" "CurrencyName" NOT NULL,
    "outputAmount" DOUBLE PRECISION NOT NULL,
    "usdEquivalent" DOUBLE PRECISION NOT NULL,
    "details" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NexoTransaction_pkey" PRIMARY KEY ("id")
);
