/*
  Warnings:

  - The required column `storeId` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "store_owner" TEXT NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storeItem" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "item_image" TEXT,
    "description" VARCHAR(500),
    "store_id" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_store_owner_key" ON "store"("store_owner");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_email_fkey" FOREIGN KEY ("email") REFERENCES "store"("store_owner") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeItem" ADD CONSTRAINT "storeItem_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
