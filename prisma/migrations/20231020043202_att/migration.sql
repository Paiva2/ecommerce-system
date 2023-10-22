/*
  Warnings:

  - You are about to drop the column `userId` on the `store` table. All the data in the column will be lost.
  - Made the column `fkstore_owner` on table `store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "store" DROP COLUMN "userId",
ALTER COLUMN "fkstore_owner" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_fkstore_owner_fkey" FOREIGN KEY ("fkstore_owner") REFERENCES "user"("email") ON DELETE CASCADE ON UPDATE CASCADE;
