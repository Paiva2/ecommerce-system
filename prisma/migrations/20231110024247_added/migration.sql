-- AlterTable
ALTER TABLE "user_coin" ADD COLUMN     "userWishListId" TEXT;

-- CreateTable
CREATE TABLE "user_wishlist" (
    "id" TEXT NOT NULL,
    "fkwishlist_owner" VARCHAR(50) NOT NULL,

    CONSTRAINT "user_wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_item" (
    "id" TEXT NOT NULL,
    "fk_wishlist_item_owner" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "item_value" DECIMAL(12,2) NOT NULL,
    "item_image" VARCHAR(150) NOT NULL,

    CONSTRAINT "wishlist_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wishlist_fkwishlist_owner_key" ON "user_wishlist"("fkwishlist_owner");

-- AddForeignKey
ALTER TABLE "user_wishlist" ADD CONSTRAINT "user_wishlist_fkwishlist_owner_fkey" FOREIGN KEY ("fkwishlist_owner") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_fk_wishlist_item_owner_fkey" FOREIGN KEY ("fk_wishlist_item_owner") REFERENCES "user_wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
