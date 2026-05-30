import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProductIds } from "@/lib/products";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://laziron.com")
).replace(/\/$/, "");

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/industry-solutions", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/shipping", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/warranty", priority: 0.3, changeFrequency: "yearly" as const },
];

function urlFor(locale: string, path: string): string {
  const isDefault = locale === routing.defaultLocale;
  if (path === "/") return isDefault ? SITE_URL : `${SITE_URL}/${locale}`;
  return isDefault ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
}

function alternatesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = urlFor(locale, path);
  }
  languages["x-default"] = urlFor(routing.defaultLocale, path);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: urlFor(locale, route.path),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: alternatesFor(route.path) },
      });
    }
  }

  for (const id of getProductIds()) {
    const path = `/products/${id}`;
    for (const locale of routing.locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: alternatesFor(path) },
      });
    }
  }

  return entries;
}
