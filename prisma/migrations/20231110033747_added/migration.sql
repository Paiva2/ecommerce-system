/*
  Warnings:

  - Added the required column `item_id` to the `wishlist_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wishlist_item" ADD COLUMN     "item_id" VARCHAR(150) NOT NULL;
