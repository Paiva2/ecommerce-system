/*
  Warnings:

  - You are about to alter the column `fkstore_owner` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE "storeItem" DROP CONSTRAINT "storeItem_fkstore_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_email_fkey";

-- AlterTable
ALTER TABLE "store" ALTER COLUMN "fkstore_owner" DROP NOT NULL,
ALTER COLUMN "fkstore_owner" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "storeItem" ALTER COLUMN "fkstore_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_email_fkey" FOREIGN KEY ("email") REFERENCES "store"("fkstore_owner") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeItem" ADD CONSTRAINT "storeItem_fkstore_id_fkey" FOREIGN KEY ("fkstore_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
