/*
  Warnings:

  - Added the required column `originalData` to the `NexoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NexoTransaction" ADD COLUMN     "originalData" JSONB NOT NULL;
