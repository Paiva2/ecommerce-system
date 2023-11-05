/*
  Warnings:

  - The `promotional_value` column on the `store_item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quantity` column on the `user_coin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `item_value` column on the `user_item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `value` on the `store_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "store_item" DROP COLUMN "value",
ADD COLUMN     "value" MONEY NOT NULL,
DROP COLUMN "promotional_value",
ADD COLUMN     "promotional_value" MONEY;

-- AlterTable
ALTER TABLE "user_coin" DROP COLUMN "quantity",
ADD COLUMN     "quantity" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_item" DROP COLUMN "item_value",
ADD COLUMN     "item_value" MONEY NOT NULL DEFAULT 0;
