/*
  Warnings:

  - Made the column `currency` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transactionType` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "transactionType" SET NOT NULL;
