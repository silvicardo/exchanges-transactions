/*
  Warnings:

  - Added the required column `originalData` to the `BitpandaTrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BitpandaTrade" ADD COLUMN     "originalData" JSONB NOT NULL;
