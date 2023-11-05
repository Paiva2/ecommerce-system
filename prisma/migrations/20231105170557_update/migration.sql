/*
  Warnings:

  - You are about to alter the column `value` on the `store_item` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `promotional_value` on the `store_item` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `quantity` on the `user_coin` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `item_value` on the `user_item` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "store_item" ALTER COLUMN "value" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "promotional_value" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "user_coin" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "user_item" ALTER COLUMN "item_value" SET DATA TYPE DECIMAL(12,2);
