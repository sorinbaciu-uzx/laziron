/**
 * Company enrichment from CUI via demoanaf.ro (free public proxy over ANAF + ONRC + MFP).
 *
 * Three parallel calls (timeout 6s each):
 *   1. GET /api/company/{cui}                — name, ONRC status, county, locality, registration date, VAT status
 *   2. GET /api/company/{cui}/balance/{Y-1}  — CAEN + balance indicators (turnover I13, profit I18, employees I20)
 *   3. GET /api/company/{cui}/balance/{Y-2}  — fallback if Y-1 hasn't been filed yet
 *
 * Failures are non-fatal: callers should treat null fields as "not available".
 */

const DEMOANAF_BASE = "https://demoanaf.ro/api/company";
const TIMEOUT_MS = 6000;

export type AnafData = {
  cui: string;
  name?: string;
  registrationNumber?: string;
  address?: string;
  county?: string;
  locality?: string;
  caenCode?: string;
  caenDescription?: string;
  /** true if VAT-registered, false if not, undefined if status unknown / verifying */
  vatActive?: boolean;
  /** true if company is in "Funcțiune" / active state */
  active?: boolean;
  companyStatus?: string;
  /** ISO date YYYY-MM-DD */
  registrationDate?: string;
  turnoverRon?: number;
  netProfitRon?: number;
  avgEmployees?: number;
  balanceYear?: number;
};

/** Strip "RO" prefix, whitespace, validate 2-10 digits. */
export function normalizeCui(input?: string | null): string | null {
  if (!input) return null;
  const cleaned = input.trim().toUpperCase().replace(/^RO/, "").replace(/\s+/g, "");
  if (!/^\d{2,10}$/.test(cleaned)) return null;
  return cleaned;
}

/** Convert "DD/MM/YYYY" to "YYYY-MM-DD" (or null if malformed). */
function toIsoDate(input?: string | null): string | null {
  if (!input) return null;
  const m = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    return null;
  }
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

async function safeFetch(url: string): Promise<Response | null> {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    console.warn("[anaf] fetch error:", url, err instanceof Error ? err.message : err);
    return null;
  }
}

type CompanyResponse = {
  success?: boolean;
  data?: {
    cui?: number;
    name?: string;
    registrationNumber?: string;
    registrationDate?: string;
    address?: string;
    onrcStatusLabel?: string;
    vatStatus?: string | null;
    headquartersAddress?: {
      county?: string;
      locality?: string;
    };
  };
};

type BalanceResponse = {
  success?: boolean;
  data?: {
    year?: number;
    caenCode?: string;
    caenDescription?: string;
    indicators?: Array<{ code?: string; value?: number; label?: string }>;
  };
};

function parseBalance(res: BalanceResponse | null): {
  caenCode?: string;
  caenDescription?: string;
  turnoverRon?: number;
  netProfitRon?: number;
  avgEmployees?: number;
  balanceYear?: number;
} | null {
  if (!res?.success || !res.data) return null;
  const { data } = res;
  const findValue = (code: string): number | undefined => {
    const found = data.indicators?.find((i) => i.code === code);
    return typeof found?.value === "number" ? found.value : undefined;
  };
  return {
    caenCode: data.caenCode,
    caenDescription: data.caenDescription,
    turnoverRon: findValue("I13"),
    netProfitRon: findValue("I18"),
    avgEmployees: findValue("I20"),
    balanceYear: data.year,
  };
}

function interpretVatStatus(status?: string | null): boolean | undefined {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (s === "active" || s === "registered" || s === "platitor") return true;
  if (s === "inactive" || s === "unregistered" || s === "neplatitor") return false;
  return undefined;
}

export async function fetchAnafData(cui: string): Promise<AnafData | null> {
  const normalized = normalizeCui(cui);
  if (!normalized) return null;

  const year = new Date().getFullYear();

  const [companyRes, balPrevRes, balTwoBackRes] = await Promise.all([
    safeFetch(`${DEMOANAF_BASE}/${normalized}`),
    safeFetch(`${DEMOANAF_BASE}/${normalized}/balance/${year - 1}`),
    safeFetch(`${DEMOANAF_BASE}/${normalized}/balance/${year - 2}`),
  ]);

  const company: CompanyResponse | null = companyRes?.ok
    ? ((await companyRes.json().catch(() => null)) as CompanyResponse | null)
    : null;
  const balPrev: BalanceResponse | null = balPrevRes?.ok
    ? ((await balPrevRes.json().catch(() => null)) as BalanceResponse | null)
    : null;
  const balTwoBack: BalanceResponse | null = balTwoBackRes?.ok
    ? ((await balTwoBackRes.json().catch(() => null)) as BalanceResponse | null)
    : null;

  const balance = parseBalance(balPrev) ?? parseBalance(balTwoBack);
  const data = company?.success ? company.data : undefined;

  const result: AnafData = {
    cui: normalized,
    name: data?.name?.trim() || undefined,
    registrationNumber: data?.registrationNumber?.trim() || undefined,
    address: data?.address?.trim() || undefined,
    county: data?.headquartersAddress?.county?.trim() || undefined,
    locality: data?.headquartersAddress?.locality?.trim() || undefined,
    companyStatus: data?.onrcStatusLabel?.trim() || undefined,
    active: data?.onrcStatusLabel?.trim().toLowerCase().startsWith("funcțiune") || undefined,
    registrationDate: toIsoDate(data?.registrationDate) ?? undefined,
    vatActive: interpretVatStatus(data?.vatStatus),
    caenCode: balance?.caenCode,
    caenDescription: balance?.caenDescription,
    turnoverRon: balance?.turnoverRon,
    netProfitRon: balance?.netProfitRon,
    avgEmployees: balance?.avgEmployees,
    balanceYear: balance?.balanceYear,
  };

  const hasAny =
    result.name ||
    result.county ||
    result.caenCode ||
    result.turnoverRon !== undefined ||
    result.vatActive !== undefined;
  return hasAny ? result : null;
}
