CREATE TABLE "QuoteRequest" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "participantCount" INTEGER,
    "datePreference" TEXT,
    "locationOption" TEXT,
    "goals" TEXT,
    "activityType" TEXT,
    "notes" TEXT,
    "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
