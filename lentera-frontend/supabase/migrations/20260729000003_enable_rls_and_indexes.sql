-- ====================================================================
-- Lentera Migration: Enable Row Level Security (RLS) & Concurrency Guards
-- ====================================================================

-- 1. Enable RLS on all existing tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any to avoid duplication
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
DROP POLICY IF EXISTS "Allow public read assets" ON assets;
DROP POLICY IF EXISTS "Deny direct anon access to admins" ON admins;
DROP POLICY IF EXISTS "Deny direct anon access to settings" ON settings;
DROP POLICY IF EXISTS "Deny direct anon access to transactions" ON transactions;

-- 3. Public Read Policies (for self-service catalog & kiosk options)
CREATE POLICY "Allow public read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read assets"
  ON assets FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Restrict sensitive tables strictly to service_role (backend route handlers)
-- Note: In Supabase, service_role bypasses RLS by default, but defining explicit
-- policies ensures fail-closed behavior for any non-service_role credentials.
CREATE POLICY "Deny direct anon access to admins"
  ON admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Deny direct anon access to settings"
  ON settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Deny direct anon access to transactions"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Concurrency & Integrity Index:
-- Prevent double-borrowing race conditions at the database constraint level.
-- Only ONE active transaction (returned_at IS NULL) may exist per asset at any time.
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_asset_borrow
  ON transactions (asset_id)
  WHERE returned_at IS NULL;
