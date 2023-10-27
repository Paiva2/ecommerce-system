/*
  Warnings:

  - You are about to drop the `storeCoin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `storeItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userCoin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "storeCoin" DROP CONSTRAINT "storeCoin_fkstore_coin_owner_fkey";

-- DropForeignKey
ALTER TABLE "storeItem" DROP CONSTRAINT "storeItem_storeId_fkey";

-- DropForeignKey
ALTER TABLE "userCoin" DROP CONSTRAINT "userCoin_fkcoin_owner_fkey";

-- DropForeignKey
ALTER TABLE "userWallet" DROP CONSTRAINT "userWallet_fkwallet_owner_fkey";

-- DropTable
DROP TABLE "storeCoin";

-- DropTable
DROP TABLE "storeItem";

-- DropTable
DROP TABLE "userCoin";

-- DropTable
DROP TABLE "userWallet";

-- CreateTable
CREATE TABLE "user_wallet" (
    "id" TEXT NOT NULL,
    "fkwallet_owner" VARCHAR(50) NOT NULL,

    CONSTRAINT "user_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coin" (
    "id" TEXT NOT NULL,
    "coin_name" VARCHAR(50) NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fkcoin_owner" VARCHAR(50) NOT NULL,
    "quantity" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "user_coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_coin" (
    "id" TEXT NOT NULL,
    "store_coin_name" VARCHAR(50) NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fkstore_coin_owner" VARCHAR(50) NOT NULL,

    CONSTRAINT "store_coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_item" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "item_image" TEXT,
    "description" VARCHAR(500),
    "fkstore_id" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fkitem_coin" VARCHAR(50) NOT NULL,
    "storeId" TEXT,
    "promotion" VARCHAR(50),

    CONSTRAINT "store_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_fkwallet_owner_key" ON "user_wallet"("fkwallet_owner");

-- CreateIndex
CREATE UNIQUE INDEX "user_coin_coin_name_key" ON "user_coin"("coin_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_coin_fkcoin_owner_key" ON "user_coin"("fkcoin_owner");

-- CreateIndex
CREATE UNIQUE INDEX "store_coin_store_coin_name_key" ON "store_coin"("store_coin_name");

-- CreateIndex
CREATE UNIQUE INDEX "store_coin_fkstore_coin_owner_key" ON "store_coin"("fkstore_coin_owner");

-- AddForeignKey
ALTER TABLE "user_wallet" ADD CONSTRAINT "user_wallet_fkwallet_owner_fkey" FOREIGN KEY ("fkwallet_owner") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coin" ADD CONSTRAINT "user_coin_fkcoin_owner_fkey" FOREIGN KEY ("fkcoin_owner") REFERENCES "user_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_coin" ADD CONSTRAINT "store_coin_fkstore_coin_owner_fkey" FOREIGN KEY ("fkstore_coin_owner") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_item" ADD CONSTRAINT "store_item_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
