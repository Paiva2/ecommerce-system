/*
  Warnings:

  - You are about to drop the column `fk_wishlist_item_owner` on the `wishlist_item` table. All the data in the column will be lost.
  - Added the required column `fkwishlist_item_owner` to the `wishlist_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "wishlist_item" DROP CONSTRAINT "wishlist_item_fk_wishlist_item_owner_fkey";

-- AlterTable
ALTER TABLE "wishlist_item" DROP COLUMN "fk_wishlist_item_owner",
ADD COLUMN     "fkwishlist_item_owner" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_fkwishlist_item_owner_fkey" FOREIGN KEY ("fkwishlist_item_owner") REFERENCES "user_wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
