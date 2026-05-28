"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Compact quote form shown inside the QuoteButton modal.
 * On submit, posts to /api/quote which creates an item on Monday board 5092118529
 * with the product name in the Produs column.
 */
export function QuoteForm({ productName }: { productName: string }) {
  const t = useTranslations("Quote");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("errorGeneric");

  const inputClasses =
    "mt-1.5 w-full rounded-md border border-ink-line/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

  if (status === "success") {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-ink">{t("success")}</p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          company: String(data.get("company") ?? ""),
          cui: String(data.get("cui") ?? ""),
          message: String(data.get("message") ?? ""),
          product: String(data.get("product") ?? ""),
          honeypot: String(data.get("website") ?? ""),
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStatus("success");
        return;
      }
      const map: Record<string, string> = {
        name_required: "errorName",
        email_invalid: "errorEmail",
        service_unavailable: "errorUnavailable",
      };
      setErrorKey(map[json.error ?? ""] ?? "errorGeneric");
      setStatus("error");
    } catch {
      setErrorKey("errorGeneric");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="hidden" name="product" value={productName} />
      {/* Honeypot — hidden field bots fill in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
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
        {t("company")}
        <input
          type="text"
          name="company"
          autoComplete="organization"
          className={inputClasses}
        />
      </label>
      <label className="block text-xs font-semibold tracking-wide text-ink/70">
        {t("cui")}
        <input
          type="text"
          name="cui"
          inputMode="numeric"
          placeholder={t("cuiPlaceholder")}
          className={inputClasses}
        />
        <span className="mt-1 block text-[10px] font-normal text-ink/50">{t("cuiHelp")}</span>
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

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {t(errorKey)}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
