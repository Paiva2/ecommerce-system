-- AlterTable
ALTER TABLE "store_item" ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "promotional_value" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "user_item" (
    "id" TEXT NOT NULL,
    "item_name" VARCHAR(50) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchased_with" VARCHAR(50) NOT NULL,
    "purchased_at" VARCHAR(50) NOT NULL,
    "fkitem_owner" VARCHAR(50) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "item_value" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "user_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_item" ADD CONSTRAINT "user_item_fkitem_owner_fkey" FOREIGN KEY ("fkitem_owner") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
