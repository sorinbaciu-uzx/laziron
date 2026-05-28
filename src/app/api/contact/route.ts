import { NextResponse } from "next/server";

/**
 * Contact form endpoint — creates a new "Lead" item on Monday board 5092118529.
 *
 * Body: { name, email, phone?, company?, message, sourceUrl?, honeypot? }
 *
 * Required env var:
 *   MONDAY_API_TOKEN — personal/integration token from Monday
 *                      (Profile → Developers → My access tokens)
 *
 * Optional env vars:
 *   MONDAY_BOARD_ID  — override the default board id (5092118529)
 *   SITE_LABEL       — override the SITE column value (default "laziron.ro")
 */

export const runtime = "nodejs";

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = Number(process.env.MONDAY_BOARD_ID) || 5092118529;
const SITE_LABEL = process.env.SITE_LABEL || "laziron.ro";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  sourceUrl?: string;
  honeypot?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.honeypot && body.honeypot.trim()) {
    return NextResponse.json({ ok: true, skipped: "honeypot" }, { status: 200 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "email_invalid" }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ ok: false, error: "message_required" }, { status: 400 });
  }

  if (!process.env.MONDAY_API_TOKEN) {
    console.error("[contact] MONDAY_API_TOKEN not configured");
    return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });
  }

  const messageWithSource = body.sourceUrl?.trim()
    ? `${message}\n\n— Sursă: ${body.sourceUrl.trim()}`
    : message;

  const columnValues: Record<string, unknown> = {
    text_mm3r9p4h: SITE_LABEL,
    lead_email: { email, text: email },
    long_text_mm1q2mrq: { text: messageWithSource },
  };
  if (body.phone?.trim()) {
    columnValues.lead_phone = { phone: body.phone.trim(), countryShortName: "RO" };
  }
  if (body.company?.trim()) {
    columnValues.lead_company = body.company.trim();
  }

  const query = `
    mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName,
        column_values: $columnValues,
        create_labels_if_missing: false
      ) {
        id
      }
    }
  `;

  try {
    const res = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        Authorization: process.env.MONDAY_API_TOKEN,
        "Content-Type": "application/json",
        "API-Version": "2024-10",
      },
      body: JSON.stringify({
        query,
        variables: {
          boardId: String(BOARD_ID),
          itemName: name,
          columnValues: JSON.stringify(columnValues),
        },
      }),
    });

    const data = (await res.json()) as {
      data?: { create_item?: { id: string } };
      errors?: { message: string }[];
      error_message?: string;
    };

    if (!res.ok || data.errors || !data.data?.create_item?.id) {
      console.error("[contact] Monday API error:", data.errors ?? data.error_message ?? res.statusText);
      return NextResponse.json({ ok: false, error: "monday_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data.data.create_item.id }, { status: 200 });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/contact",
    boardId: BOARD_ID,
    configured: Boolean(process.env.MONDAY_API_TOKEN),
  });
}
