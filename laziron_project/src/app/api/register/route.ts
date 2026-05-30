import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/password";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  password?: string;
  honeypot?: string;
};

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`register:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.honeypot && body.honeypot.trim()) {
    return NextResponse.json({ ok: true, skipped: "honeypot" }, { status: 200 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const name = body.name?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "email_invalid" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ ok: false, error: "password_short" }, { status: 400 });
  }
  const pw = validatePassword(password);
  if (!pw.ok) {
    return NextResponse.json({ ok: false, error: pw.error }, { status: 400 });
  }

  try {
    const user = await createUser({ email, name: name ?? null, password });
    return NextResponse.json({ ok: true, id: user.id, email: user.email }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "email_taken") {
      return NextResponse.json({ ok: false, error: "email_taken" }, { status: 409 });
    }
    console.error("[register] unexpected error:", err);
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}
