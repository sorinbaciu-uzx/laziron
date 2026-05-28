"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

/**
 * Compact quote form shown inside the QuoteButton modal. No backend yet — on
 * submit it shows a local success message (same pattern as ContactForm). The
 * product name is included as a hidden field so a future submit handler can
 * route the lead by product.
 */
export function QuoteForm({ productName }: { productName: string }) {
  const t = useTranslations("Quote");
  const [submitted, setSubmitted] = useState(false);

  const inputClasses =
    "mt-1.5 w-full rounded-md border border-ink-line/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-ink">{t("success")}</p>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="product" value={productName} />
      <label className="block text-xs font-semibold tracking-wide text-ink/70">
        {t("name")} *
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className={inputClasses}
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-ink/70">
        {t("email")} *
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className={inputClasses}
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-ink/70">
        {t("phone")}
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          className={inputClasses}
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-ink/70">
        {t("message")}
        <textarea
          name="message"
          rows={4}
          className={`${inputClasses} resize-none`}
        />
      </label>
      <p className="text-xs text-ink/50">{t("note")}</p>
      <button
        type="submit"
        className="w-full rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
      >
        {t("submit")}
      </button>
    </form>
  );
}
