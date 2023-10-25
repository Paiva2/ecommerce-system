/*
  Warnings:

  - A unique constraint covering the columns `[store_coin]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,store_coin]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fkitem_coin` to the `storeItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "storeItem" DROP CONSTRAINT "storeItem_fkstore_id_fkey";

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "store_coin" VARCHAR(50);

-- AlterTable
ALTER TABLE "storeItem" ADD COLUMN     "fkitem_coin" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_store_coin_key" ON "store"("store_coin");

-- CreateIndex
CREATE UNIQUE INDEX "store_id_store_coin_key" ON "store"("id", "store_coin");

-- AddForeignKey
ALTER TABLE "storeItem" ADD CONSTRAINT "storeItem_fkstore_id_fkitem_coin_fkey" FOREIGN KEY ("fkstore_id", "fkitem_coin") REFERENCES "store"("id", "store_coin") ON DELETE CASCADE ON UPDATE CASCADE;
