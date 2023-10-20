/*
  Warnings:

  - Made the column `fkstore_id` on table `storeItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "storeItem" ALTER COLUMN "fkstore_id" SET NOT NULL;
