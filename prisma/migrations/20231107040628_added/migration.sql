-- CreateTable
CREATE TABLE "storeCoupon" (
    "id" TEXT NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "fkcoupon_owner" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_At" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "validation_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storeCoupon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storeCoupon" ADD CONSTRAINT "storeCoupon_fkcoupon_owner_fkey" FOREIGN KEY ("fkcoupon_owner") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
