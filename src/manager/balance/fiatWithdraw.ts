import { PrismaClient } from "@prisma/client";
import { database } from "../../db";

/*
 * This functions just retrieves funds withdrawal
 * from an exchange account and does not cover selling to fiat
 * that is another operation
 */
export const getFiatWithdrawalOperationsTotal = async (): Promise<{
  account: Record<string, number>;
  total: number;
}> => {
  const prisma = new PrismaClient();
  /*
   * Bitpanda support only fiat EUR withdrawals
   * and they can be done in two ways:
   * - card withdrawal
   * - bank withdrawal
   */
  const bitpanda = (
    await database.selectors.bitpanda.withdrawals.getFiat(prisma)
  ).reduce((acc, curr) => acc + curr.amountFiat, 0);
  /*
   * Bitpanda Pro doesn't support fiat withdrawals
   * You can only move fiat to bitpanda base account
   */
  const bitpandaPro = 0;

  /*
   * Nexo doesn't support fiat withdrawals in practice.
   * It actually lets you convert EUR to EURX on deposit
   * and if directly sell EURX without any third currency involved
   * in that case so it's a not taxable event
   * since 1 EURX = 1 EUR at all times so no loss/gain
   */
  const nexo = 0;
  /*
   * Crypto.com App supports fiat withdrawals through card
   * at least i've never used bank transfer
   * many of the total amount are actually just a bank EUR top up
   * being transferred to the card, this does not calculate this
   */
  const cryptoComApp = (
    await database.selectors.cryptoComApp.withdrawals.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.amount, 0);

  /*
   * no withdraw on Crypto.com exchange
   * just a placeholder for me to remember
   */
  const cryptoComExchange = 0;

  const youngPlatform = (
    await database.selectors.youngPlatform.withdrawals.getAllFiat(prisma)
  ).reduce((acc, curr) => acc + curr.credit, 0);

  return {
    account: {
      bitpanda,
      bitpandaPro,
      nexo,
      cryptoComApp,
      cryptoComExchange,
      youngPlatform,
    },
    total:
      cryptoComExchange +
      bitpanda +
      bitpandaPro +
      nexo +
      cryptoComApp +
      youngPlatform,
  };
};

getFiatWithdrawalOperationsTotal().then(console.log);
