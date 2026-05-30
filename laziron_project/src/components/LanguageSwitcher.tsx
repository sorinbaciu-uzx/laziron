"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, { short: string; name: string }> = {
  ro: { short: "RO", name: "Română" },
  en: { short: "EN", name: "English" },
  cs: { short: "CS", name: "Čeština" },
  pl: { short: "PL", name: "Polski" },
};

export function LanguageSwitcher() {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next !== locale) {
      router.replace(pathname, { locale: next });
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="inline-flex items-center gap-1.5 rounded-md border border-ink-line/20 px-2.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
        {localeLabels[locale].short}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-ink-line/15 bg-white py-1 shadow-lg"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => switchTo(l)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-ink/5 ${
                  l === locale ? "font-semibold text-gold" : "text-ink"
                }`}
              >
                <span>{localeLabels[l].name}</span>
                <span className="text-xs text-ink/50">{localeLabels[l].short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
