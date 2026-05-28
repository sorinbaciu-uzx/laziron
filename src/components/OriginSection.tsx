"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const points = [1, 2, 3] as const;

/**
 * "Din China, pentru România" value-proposition band.
 *
 * Client component so it can animate: minimalist outlined shapes float gently
 * in the background and the content reveals with a staggered fade/slide once
 * the band scrolls into view. White background, gold/ink only as accents.
 * All motion is disabled under `prefers-reduced-motion`.
 */
export function OriginSection() {
  const t = useTranslations("Origin");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal =
    "transition-all duration-700 ease-out motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none";
  const revealState = visible
    ? "translate-y-0 opacity-100"
    : "translate-y-5 opacity-0";
  const delay = (ms: number) => ({
    transitionDelay: visible ? `${ms}ms` : "0ms",
  });

  return (
    <section className="pb-12 sm:pb-16">
      <div className="container-page">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white px-5 py-10 shadow-sm sm:px-8 sm:py-14 lg:px-12"
        >
          {/* Minimalist floating shapes — subtle, professional motion */}
          <span
            aria-hidden="true"
            className="float-y absolute -top-16 -right-12 h-56 w-56 rounded-full border border-gold/25"
          />
          <span
            aria-hidden="true"
            className="float-y-rev absolute -bottom-20 right-24 h-32 w-32 rounded-full border border-ink/10"
          />
          <span
            aria-hidden="true"
            className="dot-grid float-y absolute bottom-6 left-6 h-24 w-40 opacity-50"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-dark uppercase ${reveal} ${revealState}`}
                style={delay(0)}
              >
                <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
                {t("eyebrow")}
              </span>
              <h2
                className={`mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl ${reveal} ${revealState}`}
                style={delay(90)}
              >
                {t("title")}
              </h2>
              <p
                className={`mt-5 text-xl font-extrabold leading-snug text-gold-dark sm:text-2xl ${reveal} ${revealState}`}
                style={delay(180)}
              >
                {t("slogan")}
              </p>
              <p
                className={`mt-4 text-ink/70 ${reveal} ${revealState}`}
                style={delay(270)}
              >
                {t("text")}
              </p>
              <div className={`${reveal} ${revealState}`} style={delay(360)}>
                <Link
                  href="/contact"
                  className="mt-7 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
                >
                  {t("cta")}
                </Link>
              </div>
            </div>

            <ul className="grid gap-4">
              {points.map((n, i) => (
                <li
                  key={n}
                  className={`group rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/15 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${revealState}`}
                  style={delay(440 + i * 120)}
                >
                  <h3 className="flex items-center gap-2 font-bold text-ink">
                    <span className="inline-block h-4 w-1 rounded-full bg-gold" />
                    {t(`point${n}Title`)}
                  </h3>
                  <p className="mt-1 text-sm text-ink/65">
                    {t(`point${n}Desc`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
