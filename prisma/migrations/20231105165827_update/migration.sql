/*
  Warnings:

  - You are about to alter the column `quantity` on the `user_item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "user_item" ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;
