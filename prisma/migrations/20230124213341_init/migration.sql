/*
  Warnings:

  - Added the required column `originalData` to the `YoungPlatformMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YoungPlatformMovement" ADD COLUMN     "originalData" JSONB NOT NULL;
