import { Pool } from "pg";

/**
 * Shared Postgres connection pool.
 *
 * On Vercel, `POSTGRES_URL` is provided automatically by the Vercel Postgres
 * (Neon) integration and points to a pooled connection. We reuse a single
 * `Pool` instance per Node process — Vercel serverless functions share it
 * across warm invocations, which dramatically reduces connection churn.
 */

declare global {
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL env var is not set");
  }
  // `rejectUnauthorized: false` is required for Neon's pooled endpoint
  // (uses self-signed certs in some regions). Neon enforces TLS at the
  // network layer anyway, so the connection is still encrypted.
  return new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

export const pool: Pool = globalThis.__pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}
