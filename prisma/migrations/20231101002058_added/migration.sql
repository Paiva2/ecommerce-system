/*
  Warnings:

  - Added the required column `colors` to the `store_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizes` to the `store_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_item" ADD COLUMN     "colors" VARCHAR(50) NOT NULL,
ADD COLUMN     "sizes" VARCHAR(50) NOT NULL;
