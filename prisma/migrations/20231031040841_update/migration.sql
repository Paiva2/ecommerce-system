/*
  Warnings:

  - You are about to drop the column `created_At` on the `store_item` table. All the data in the column will be lost.
  - You are about to drop the column `fkitem_coin` on the `store_item` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `store_item` table. All the data in the column will be lost.
  - The `promotion` column on the `store_item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `fkstore_coin` to the `store_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "store_item" DROP CONSTRAINT "store_item_storeId_fkey";

-- AlterTable
ALTER TABLE "store_item" DROP COLUMN "created_At",
DROP COLUMN "fkitem_coin",
DROP COLUMN "storeId",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fkstore_coin" TEXT NOT NULL,
ADD COLUMN     "promotional_value" INTEGER,
ALTER COLUMN "value" DROP DEFAULT,
DROP COLUMN "promotion",
ADD COLUMN     "promotion" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "store_item" ADD CONSTRAINT "store_item_fkstore_id_fkey" FOREIGN KEY ("fkstore_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_item" ADD CONSTRAINT "store_item_fkstore_coin_fkey" FOREIGN KEY ("fkstore_coin") REFERENCES "store_coin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
