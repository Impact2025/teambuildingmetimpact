-- Enable Row Level Security for all tables
-- This migration adds RLS policies to protect your database
--
-- IMPORTANT: This app uses NextAuth with server-side Prisma queries.
-- RLS policies block client-side access while allowing service_role (Prisma) access.
-- Public read access is granted for published content only.

-- =============================================================================
-- AUTH TABLES (NextAuth) - Server-side only
-- =============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- No public policies - all access via server-side API
CREATE POLICY "Service role only for users"
  ON "User"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for accounts"
  ON "Account"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for sessions"
  ON "Session"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for verification tokens"
  ON "VerificationToken"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- WORKSHOP MANAGEMENT (Server-side only)
-- =============================================================================

ALTER TABLE "Workshop" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for workshops"
  ON "Workshop"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "WorkshopSession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for workshop sessions"
  ON "WorkshopSession"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "SessionState" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for session states"
  ON "SessionState"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "BuildUpload" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for build uploads"
  ON "BuildUpload"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "ChecklistItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for checklist items"
  ON "ChecklistItem"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "AIReport" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for AI reports"
  ON "AIReport"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "AlarmSetting" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for alarm settings"
  ON "AlarmSetting"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "RunOfShowEvent" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for run of show events"
  ON "RunOfShowEvent"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

ALTER TABLE "WorkshopState" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for workshop states"
  ON "WorkshopState"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- BLOG POSTS (Public read for published, server-side write)
-- =============================================================================

ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Anyone can read published blog posts"
  ON "BlogPost"
  FOR SELECT
  USING (status = 'PUBLISHED');

-- Server-side (Prisma) has full access
CREATE POLICY "Service role full access to blog posts"
  ON "BlogPost"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- QUOTE REQUESTS (Public insert, server-side read/delete)
-- =============================================================================

ALTER TABLE "QuoteRequest" ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a quote request via the public form
CREATE POLICY "Anyone can create quote requests"
  ON "QuoteRequest"
  FOR INSERT
  WITH CHECK (true);

-- Server-side has full read/delete access for admin panel
CREATE POLICY "Service role full access to quote requests"
  ON "QuoteRequest"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- TEAMDAY PROGRAM (Public read, server-side write)
-- =============================================================================

ALTER TABLE "TeamdayProgram" ENABLE ROW LEVEL SECURITY;

-- Public can read teamday programs (for viewer page)
CREATE POLICY "Anyone can read teamday programs"
  ON "TeamdayProgram"
  FOR SELECT
  USING (true);

-- Server-side has full access for admin panel
CREATE POLICY "Service role full access to teamday programs"
  ON "TeamdayProgram"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- TEAMDAY SESSIONS (Server-side only)
-- =============================================================================

ALTER TABLE "TeamdaySession" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for teamday sessions"
  ON "TeamdaySession"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- TEAMDAY UPLOADS (Server-side only)
-- =============================================================================

ALTER TABLE "TeamdayUpload" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for teamday uploads"
  ON "TeamdayUpload"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- TEAMDAY REVIEWS (Public read approved + insert, server-side manages)
-- =============================================================================

ALTER TABLE "TeamdayReview" ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews (for homepage)
CREATE POLICY "Anyone can read approved reviews"
  ON "TeamdayReview"
  FOR SELECT
  USING (status = 'APPROVED');

-- Public can submit reviews via review form
CREATE POLICY "Anyone can submit reviews"
  ON "TeamdayReview"
  FOR INSERT
  WITH CHECK (true);

-- Server-side has full access for admin panel
CREATE POLICY "Service role full access to reviews"
  ON "TeamdayReview"
  FOR ALL
  USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
