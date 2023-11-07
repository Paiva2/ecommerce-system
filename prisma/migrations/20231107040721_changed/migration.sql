/*
  Warnings:

  - You are about to drop the `storeCoupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "storeCoupon" DROP CONSTRAINT "storeCoupon_fkcoupon_owner_fkey";

-- DropTable
DROP TABLE "storeCoupon";

-- CreateTable
CREATE TABLE "store_coupon" (
    "id" TEXT NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "fkcoupon_owner" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "validation_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_coupon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "store_coupon" ADD CONSTRAINT "store_coupon_fkcoupon_owner_fkey" FOREIGN KEY ("fkcoupon_owner") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
