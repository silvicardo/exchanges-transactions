/*
  Warnings:

  - You are about to drop the column `DateTime` on the `NexoTransaction` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `NexoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NexoTransaction" DROP COLUMN "DateTime",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
