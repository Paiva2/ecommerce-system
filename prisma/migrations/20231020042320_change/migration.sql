-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_email_fkey";

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "userId" TEXT;
