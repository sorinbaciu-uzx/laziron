"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Renders the product's rich HTML description, clamped to ~10 lines with a
 * "read more" toggle that expands to the full content.
 */
export function ProductDescription({ html }: { html: string }) {
  const t = useTranslations("Common");
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`prose-lzr ${expanded ? "" : "prose-clamp"}`}
        style={expanded ? undefined : { maxHeight: "15rem" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold"
      >
        {expanded ? t("readLess") : t("readMore")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
