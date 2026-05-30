-- =============================================================================
-- LAZIRON Postgres schema — users table
--
-- Rulează o singură dată după crearea bazei Vercel Postgres:
--   1. Vercel → Storage → laziron-db → tab "Query"
--   2. Lipești tot conținutul de mai jos
--   3. Run
--
-- SAU, dacă ai psql instalat local:
--   psql "$POSTGRES_URL_NON_POOLING" -f scripts/init-db.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email));
