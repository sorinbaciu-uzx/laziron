import { NextResponse } from "next/server";
import { fetchAnafData, normalizeCui, type AnafData } from "@/lib/anaf";

/**
 * Quote form endpoint — creates a "Lead" item on Monday board 5092118529
 * (same board as /api/contact, distinguished by the Produs column).
 *
 * Body: { name, email, phone?, company?, cui?, product, message?, sourceUrl?, honeypot? }
 *
 * When a valid CUI is provided, the server calls ANAF + demoanaf in parallel
 * to enrich the lead with county / locality / CAEN / VAT status / financials.
 * Enrichment failures are non-fatal — the lead is still created.
 *
 * Required env: MONDAY_API_TOKEN
 * Optional env: MONDAY_BOARD_ID (default 5092118529), SITE_LABEL (default "laziron.com")
 */

export const runtime = "nodejs";

const MONDAY_API_URL = "https://api.monday.com/v2";
const BOARD_ID = Number(process.env.MONDAY_BOARD_ID) || 5092118529;
const SITE_LABEL = process.env.SITE_LABEL || "laziron.com";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  cui?: string;
  product?: string;
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
  const product = body.product?.trim();
  const userMessage = body.message?.trim();
  const companyFromForm = body.company?.trim();
  const cui = normalizeCui(body.cui);

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "email_invalid" }, { status: 400 });
  }

  if (!process.env.MONDAY_API_TOKEN) {
    console.error("[quote] MONDAY_API_TOKEN not configured");
    return NextResponse.json({ ok: false, error: "service_unavailable" }, { status: 503 });
  }

  // ANAF enrichment (non-fatal)
  let anaf: AnafData | null = null;
  if (cui) {
    try {
      anaf = await fetchAnafData(cui);
    } catch (err) {
      console.warn("[quote] ANAF lookup failed:", err instanceof Error ? err.message : err);
    }
  }

  const companyName = anaf?.name || companyFromForm;

  const columnValues: Record<string, unknown> = {
    text_mm3r9p4h: SITE_LABEL,
    lead_email: { email, text: email },
  };
  if (userMessage) {
    columnValues.long_text_mm1q2mrq = { text: userMessage };
  }
  if (body.phone?.trim()) {
    columnValues.lead_phone = { phone: body.phone.trim(), countryShortName: "RO" };
  }
  if (product) {
    columnValues.text = product;
  }
  if (companyName) {
    columnValues.lead_company = companyName;
  }
  if (cui) {
    columnValues.text_mm1s607t = cui;
  }
  if (anaf) {
    if (anaf.county) columnValues.text_mm2kbwb8 = anaf.county;
    if (anaf.locality) columnValues.text_mm2kwwme = anaf.locality;
    if (anaf.caenCode) columnValues.text_mm2k2td3 = anaf.caenCode;
    if (anaf.caenDescription) columnValues.text_mm2kvjah = anaf.caenDescription;
    if (typeof anaf.vatActive === "boolean") {
      columnValues.boolean_mm2kqyn4 = { checked: anaf.vatActive ? "true" : "false" };
    }
    if (anaf.registrationDate && /^\d{4}-\d{2}-\d{2}$/.test(anaf.registrationDate)) {
      columnValues.date_mm2kd7da = { date: anaf.registrationDate };
    }
    if (typeof anaf.turnoverRon === "number") {
      columnValues.numeric_mm2kscqx = anaf.turnoverRon;
    }
    if (typeof anaf.netProfitRon === "number") {
      columnValues.numeric_mm2k3b03 = anaf.netProfitRon;
    }
    if (typeof anaf.avgEmployees === "number") {
      columnValues.numeric_mm2krskv = anaf.avgEmployees;
    }
  }

  const itemName = (() => {
    const parts = [name];
    if (companyName) parts.push(companyName);
    if (product) parts.push(product);
    return parts.join(" — ").slice(0, 255);
  })();

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
          itemName,
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
      console.error("[quote] Monday API error:", data.errors ?? data.error_message ?? res.statusText);
      return NextResponse.json({ ok: false, error: "monday_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: data.data.create_item.id, enriched: Boolean(anaf) }, { status: 200 });
  } catch (err) {
    console.error("[quote] unexpected error:", err);
    return NextResponse.json({ ok: false, error: "unexpected" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/quote",
    boardId: BOARD_ID,
    configured: Boolean(process.env.MONDAY_API_TOKEN),
  });
}
