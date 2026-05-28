"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-ink-line/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Design-only. Account creation is wired in once Vercel + backend are live.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label className="block text-sm font-medium text-ink">
        {t("name")}
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {t("email")}
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {t("password")}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            required
            className={`${fieldClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="absolute inset-y-0 right-0 mt-1.5 mr-1 inline-flex w-10 items-center justify-center rounded-md text-ink/60 transition-colors hover:text-gold-dark"
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 3l18 18M10.6 6.1A10.4 10.4 0 0 1 12 6c5 0 9 6 9 6a17.4 17.4 0 0 1-2.4 3.1M6.3 7.6A17.5 17.5 0 0 0 3 12s4 6 9 6c1.4 0 2.7-.4 3.8-1M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            )}
          </button>
        </div>
        <span className="mt-1 block text-xs text-ink/50">
          {t("passwordHint")}
        </span>
      </label>

      <label className="block text-sm font-medium text-ink">
        {t("confirmPassword")}
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          required
          className={fieldClass}
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 h-4 w-4 rounded border-ink-line/30 text-gold accent-gold focus:ring-gold"
        />
        <span>
          {t("termsLabel")}{" "}
          <a
            href="#"
            className="font-semibold text-gold-dark transition-colors hover:text-ink"
          >
            {t("termsLink")}
          </a>
        </span>
      </label>

      <button
        type="submit"
        className="w-full rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
      >
        {t("registerCta")}
      </button>

      <p className="text-center text-sm text-ink/70">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-gold-dark transition-colors hover:text-ink"
        >
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
