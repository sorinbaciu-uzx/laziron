import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  RO: "ro",
  MD: "ro",
  CZ: "cs",
  SK: "cs",
  PL: "pl",
};

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getExplicitLocale(pathname: string): Locale | null {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale as Locale;
    }
  }
  return null;
}

function detectFromHeaders(request: NextRequest): Locale | null {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && COUNTRY_TO_LOCALE[country]) {
    return COUNTRY_TO_LOCALE[country];
  }

  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase().split("-")[0];
    if (tag && (routing.locales as readonly string[]).includes(tag)) {
      return tag as Locale;
    }
  }

  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const explicitLocale = getExplicitLocale(pathname);
  const hasCookie = request.cookies.has(LOCALE_COOKIE);

  if (!explicitLocale && !hasCookie) {
    const detected = detectFromHeaders(request);

    if (detected && detected !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detected}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, detected, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
