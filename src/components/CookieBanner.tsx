"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "laziron-cookie-consent";

type Consent = {
  essential: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
};

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setShow(true);
      }
    } catch {
      setShow(true);
    }
  }, []);

  function save(consent: Omit<Consent, "acceptedAt">) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...consent, acceptedAt: new Date().toISOString() }),
      );
    } catch {
      // localStorage may be blocked (private mode); banner closes anyway.
    }
    setShow(false);
  }

  function acceptAll() {
    save({ essential: true, preferences: true, analytics: true, marketing: true });
  }

  function rejectNonEssential() {
    save({ essential: true, preferences: false, analytics: false, marketing: false });
  }

  function savePreferences() {
    save({
      essential: true,
      preferences,
      analytics: false,
      marketing: false,
    });
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md"
    >
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xl shadow-ink/15 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-dark">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 109 14 4 4 0 01-5-5 4 4 0 01-4-4 4 4 0 010-5z" />
              <circle cx="8.5" cy="11" r="0.8" fill="currentColor" />
              <circle cx="13" cy="14.5" r="0.8" fill="currentColor" />
              <circle cx="16" cy="9" r="0.8" fill="currentColor" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="font-bold text-ink">{t("title")}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
              {t("body")}{" "}
              <Link
                href="/cookies"
                className="font-semibold text-gold-dark underline-offset-2 transition-colors hover:text-ink hover:underline"
              >
                {t("learnMore")}
              </Link>
            </p>
          </div>
        </div>

        {customize && (
          <ul className="mt-5 space-y-3 border-t border-ink/10 pt-4 text-sm">
            <li className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{t("categoryEssential")}</p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {t("categoryEssentialDesc")}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink/60">
                {t("required")}
              </span>
            </li>
            <li className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{t("categoryPreferences")}</p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {t("categoryPreferencesDesc")}
                </p>
              </div>
              <label className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="block h-6 w-11 rounded-full bg-ink/15 transition-colors peer-checked:bg-gold" />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </li>
          </ul>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {customize ? (
            <>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-md border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
              >
                {t("rejectAll")}
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-dark"
              >
                {t("save")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustomize(true)}
                className="rounded-md border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
              >
                {t("customize")}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-dark"
              >
                {t("accept")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
