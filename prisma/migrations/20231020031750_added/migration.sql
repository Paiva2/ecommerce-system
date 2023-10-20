/*
  Warnings:

  - You are about to drop the column `store_owner` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `storeItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fkstore_owner]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fkstore_owner` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fkstore_id` to the `storeItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "storeItem" DROP CONSTRAINT "storeItem_store_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_email_fkey";

-- DropIndex
DROP INDEX "store_store_owner_key";

-- AlterTable
ALTER TABLE "store" DROP COLUMN "store_owner",
ADD COLUMN     "fkstore_owner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "storeItem" DROP COLUMN "store_id",
ADD COLUMN     "fkstore_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_fkstore_owner_key" ON "store"("fkstore_owner");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_email_fkey" FOREIGN KEY ("email") REFERENCES "store"("fkstore_owner") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeItem" ADD CONSTRAINT "storeItem_fkstore_id_fkey" FOREIGN KEY ("fkstore_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
