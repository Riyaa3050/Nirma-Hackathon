-- CreateEnum
CREATE TYPE "Type" AS ENUM ('completed', 'flagged');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "risk" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'completed';
