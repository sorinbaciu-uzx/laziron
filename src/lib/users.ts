import bcrypt from "bcryptjs";
import { pool } from "./db";

export type User = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
};

type UserRow = {
  id: number;
  email: string;
  name: string | null;
  password_hash: string;
  created_at: Date;
};

const BCRYPT_ROUNDS = 12;

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<UserRow>(
    "SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
    [email.toLowerCase().trim()],
  );
  return rows[0] ? toUser(rows[0]) : null;
}

export async function findUserById(id: number): Promise<User | null> {
  const { rows } = await pool.query<UserRow>(
    "SELECT id, email, name, password_hash, created_at FROM users WHERE id = $1 LIMIT 1",
    [id],
  );
  return rows[0] ? toUser(rows[0]) : null;
}

/**
 * Verifies an email/password combo. Returns the user if valid, or null if
 * email doesn't exist OR password doesn't match. Uses constant-time bcrypt
 * comparison to avoid timing attacks.
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | null> {
  const { rows } = await pool.query<UserRow>(
    "SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
    [email.toLowerCase().trim()],
  );
  const row = rows[0];
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  return ok ? toUser(row) : null;
}

/**
 * Creates a new user. Throws if email already exists. Password is bcrypt-hashed
 * before storage.
 */
export async function createUser(input: {
  email: string;
  name?: string | null;
  password: string;
}): Promise<User> {
  const email = input.email.toLowerCase().trim();
  const name = input.name?.trim() || null;
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  try {
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, password_hash, created_at`,
      [email, name, passwordHash],
    );
    return toUser(rows[0]);
  } catch (err) {
    if (err instanceof Error && /unique/i.test(err.message)) {
      const e = new Error("email_taken");
      throw e;
    }
    throw err;
  }
}
