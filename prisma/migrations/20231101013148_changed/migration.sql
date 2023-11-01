-- DropForeignKey
ALTER TABLE "store_item" DROP CONSTRAINT "store_item_fkstore_coin_fkey";

-- AddForeignKey
ALTER TABLE "store_item" ADD CONSTRAINT "store_item_fkstore_coin_fkey" FOREIGN KEY ("fkstore_coin") REFERENCES "store_coin"("store_coin_name") ON DELETE CASCADE ON UPDATE CASCADE;
