"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend wired yet — this is a UI skeleton.
    // TODO: connect to an email service / API route.
    setSubmitted(true);
  }

  const fieldClass =
    "mt-1.5 w-full rounded-md border border-ink-line/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30";

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-ink">{t("formSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
      <button
        type="submit"
        className="rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
      >
        {t("formSubmit")}
      </button>
    </form>
  );
}
