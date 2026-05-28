import { getTranslations } from "next-intl/server";

const MAPS_QUERY =
  "https://www.google.com/maps/search/?api=1&query=Kerry+Plaza+Tower+2+Zhong+Xin+Fourth+Road+Futian+Shenzhen";

export async function OfficeAddress() {
  const t = await getTranslations("About");

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-gold-dark">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
            <circle cx="12" cy="9" r="2.6" />
          </svg>
        </span>
        <h3 className="text-xs font-bold tracking-widest text-gold-dark uppercase">
          {t("officeTitle")}
        </h3>
      </div>
      <p className="mt-5 text-lg font-bold text-ink">Laziron Office</p>
      <address className="mt-2 text-sm leading-relaxed text-ink/80 not-italic">
        Kerry Plaza Tower 2<br />
        No. 1 Zhong Xin Fourth Road<br />
        Futian District, Shenzhen<br />
        Guangdong 518046<br />
        China
      </address>
      <a
        href={MAPS_QUERY}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold"
      >
        {t("officeMapsCta")}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </a>
    </div>
  );
}
