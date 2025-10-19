-- CreateEnum
CREATE TYPE "TeamdayReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "TeamdayReview"
  ADD COLUMN "status" "TeamdayReviewStatus" NOT NULL DEFAULT 'PENDING';
