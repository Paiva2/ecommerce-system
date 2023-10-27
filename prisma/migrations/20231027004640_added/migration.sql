/*
  Warnings:

  - You are about to drop the column `store_coin` on the `store` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "storeItem" DROP CONSTRAINT "storeItem_fkstore_id_fkitem_coin_fkey";

-- DropIndex
DROP INDEX "store_id_store_coin_key";

-- DropIndex
DROP INDEX "store_store_coin_key";

-- AlterTable
ALTER TABLE "store" DROP COLUMN "store_coin";

-- AlterTable
ALTER TABLE "storeItem" ADD COLUMN     "promotion" VARCHAR(50),
ADD COLUMN     "storeId" TEXT;

-- CreateTable
CREATE TABLE "userWallet" (
    "id" TEXT NOT NULL,
    "fkwallet_owner" VARCHAR(50) NOT NULL,

    CONSTRAINT "userWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCoin" (
    "id" TEXT NOT NULL,
    "coin_name" VARCHAR(50) NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fkcoin_owner" VARCHAR(50) NOT NULL,
    "quantity" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "userCoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storeCoin" (
    "id" TEXT NOT NULL,
    "store_coin_name" VARCHAR(50) NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fkstore_coin_owner" VARCHAR(50) NOT NULL,

    CONSTRAINT "storeCoin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userWallet_fkwallet_owner_key" ON "userWallet"("fkwallet_owner");

-- CreateIndex
CREATE UNIQUE INDEX "userCoin_coin_name_key" ON "userCoin"("coin_name");

-- CreateIndex
CREATE UNIQUE INDEX "userCoin_fkcoin_owner_key" ON "userCoin"("fkcoin_owner");

-- CreateIndex
CREATE UNIQUE INDEX "storeCoin_store_coin_name_key" ON "storeCoin"("store_coin_name");

-- CreateIndex
CREATE UNIQUE INDEX "storeCoin_fkstore_coin_owner_key" ON "storeCoin"("fkstore_coin_owner");

-- AddForeignKey
ALTER TABLE "userWallet" ADD CONSTRAINT "userWallet_fkwallet_owner_fkey" FOREIGN KEY ("fkwallet_owner") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCoin" ADD CONSTRAINT "userCoin_fkcoin_owner_fkey" FOREIGN KEY ("fkcoin_owner") REFERENCES "userWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeCoin" ADD CONSTRAINT "storeCoin_fkstore_coin_owner_fkey" FOREIGN KEY ("fkstore_coin_owner") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeItem" ADD CONSTRAINT "storeItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
