/*
  Warnings:

  - Added the required column `total_value` to the `user_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_item" ADD COLUMN     "total_value" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "quantity" DROP DEFAULT,
ALTER COLUMN "item_value" DROP DEFAULT;
