"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("formErrorGeneric");

  const fieldClass =
    "mt-1.5 w-full rounded-md border border-ink-line/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          company: String(data.get("company") ?? ""),
          message: String(data.get("message") ?? ""),
          honeypot: String(data.get("website") ?? ""),
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      const map: Record<string, string> = {
        name_required: "formErrorName",
        email_invalid: "formErrorEmail",
        message_required: "formErrorMessage",
        service_unavailable: "formErrorUnavailable",
      };
      setErrorKey(map[json.error ?? ""] ?? "formErrorGeneric");
      setStatus("error");
    } catch {
      setErrorKey("formErrorGeneric");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-ink">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — hidden field bots fill in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          {t("formName")} *
          <input name="name" type="text" required className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t("formEmail")} *
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t("formPhone")}
          <input name="phone" type="tel" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t("formCompany")}
          <input name="company" type="text" className={fieldClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">
        {t("formMessage")} *
        <textarea name="message" required rows={5} className={fieldClass} />
      </label>
      <p className="text-xs text-ink/50">{t("formNote")}</p>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {t(errorKey)}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t("formSending") : t("formSubmit")}
      </button>
    </form>
  );
}
