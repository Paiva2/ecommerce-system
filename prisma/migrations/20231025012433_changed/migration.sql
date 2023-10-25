/*
  Warnings:

  - You are about to drop the column `updated_At` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "store" DROP COLUMN "updated_At",
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
