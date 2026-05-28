import { defineRouting } from "next-intl/routing";

/**
 * Locale configuration for the LAZIRON site.
 * Romanian (ro) is the source/default language; en, cs and pl are translations.
 * `as-needed` keeps the default locale (ro) at the root path (/) and prefixes
 * the others (/en, /cs, /pl).
 */
export const routing = defineRouting({
  locales: ["ro", "en", "cs", "pl"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
