/*
  Warnings:

  - Added the required column `userAccountId` to the `NexoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NexoTransaction" ADD COLUMN     "userAccountId" INTEGER NOT NULL;
