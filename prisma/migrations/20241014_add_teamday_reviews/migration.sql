-- CreateTable
CREATE TABLE "TeamdayReview" (
    "id" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "programId" TEXT,
    CONSTRAINT "TeamdayReview_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TeamdayReview_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

-- CreateIndex
CREATE INDEX "TeamdayReview_sessionKey_idx" ON "TeamdayReview"("sessionKey");

-- AddForeignKey
ALTER TABLE "TeamdayReview" ADD CONSTRAINT "TeamdayReview_programId_fkey" FOREIGN KEY ("programId") REFERENCES "TeamdayProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
