"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type LaserTimelineItem = {
  /** Title shown under the animation. */
  title: string;
  /** Short description under the title. */
  desc: string;
  /** The animation card (SVG). */
  anim: ReactNode;
  /** Marketing pitch headline, shown on the opposite side of the timeline. */
  pitchTitle: string;
  /** Marketing pitch body. */
  pitchText: string;
};

/**
 * Vertical timeline with a central line and a dot per item. Each row places
 * the animation on one side and a marketing pitch on the opposite side,
 * alternating direction down the list. Dots latch to gold once their row
 * has scrolled into view; content fades in. Mobile stacks to a single column
 * without the timeline. Respects `prefers-reduced-motion`.
 */
export function LaserTimeline({
  items,
  pitchEyebrow,
}: {
  items: LaserTimelineItem[];
  pitchEyebrow?: string;
}) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [shown, setShown] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown((prev) => {
              if (prev[i]) return prev;
              const next = [...prev];
              next[i] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative">
      {/* Central vertical line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-ink/15"
      />
      <ul className="space-y-10 lg:space-y-24">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          const active = shown[i];
          const cardSide = isLeft ? "col-start-1" : "col-start-3";
          const pitchSide = isLeft ? "col-start-3" : "col-start-1";
          const cardHidden = isLeft ? "-translate-x-3 lg:-translate-x-6" : "translate-x-3 lg:translate-x-6";
          const pitchHidden = isLeft ? "translate-x-3 lg:translate-x-6" : "-translate-x-3 lg:-translate-x-6";

          return (
            <li
              key={item.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative grid items-center gap-3 grid-cols-[1fr_1.5rem_1fr] lg:grid-cols-[1fr_3rem_1fr] lg:gap-10"
            >
              {/* Animation + caption */}
              <div
                className={`row-start-1 transition-all duration-700 ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-100 ${cardSide} ${
                  active
                    ? "translate-x-0 opacity-100"
                    : `opacity-0 ${cardHidden}`
                }`}
              >
                <div className="space-y-2 sm:space-y-4">
                  {item.anim}
                  <div className="mx-auto max-w-md">
                    <h3 className="text-xs font-bold text-ink sm:text-base lg:text-lg">{item.title}</h3>
                    <p className="mt-1 text-[11px] leading-tight text-ink/65 sm:text-sm sm:leading-normal">{item.desc}</p>
                  </div>
                </div>
              </div>

              {/* Timeline dot — turns gold once this item has scrolled into view */}
              <span
                aria-hidden="true"
                className={`col-start-2 row-start-1 mx-auto block h-3 w-3 rounded-full border-2 transition-all duration-500 ease-out sm:h-5 sm:w-5 ${
                  active
                    ? "border-gold bg-gold shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-gold)_25%,transparent)] sm:shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-gold)_25%,transparent)]"
                    : "border-ink/30 bg-white"
                }`}
              />

              {/* Marketing pitch — opposite side */}
              <div
                className={`row-start-1 transition-all duration-700 ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-100 ${pitchSide} ${
                  active
                    ? "translate-x-0 opacity-100"
                    : `opacity-0 ${pitchHidden}`
                }`}
                style={{ transitionDelay: active ? "150ms" : "0ms" }}
              >
                {pitchEyebrow && (
                  <p className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-widest text-gold-dark uppercase sm:gap-2 sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold sm:h-2 sm:w-2" />
                    {pitchEyebrow}
                  </p>
                )}
                <h4 className="mt-2 text-sm font-extrabold leading-snug text-ink sm:mt-4 sm:text-2xl">
                  {item.pitchTitle}
                </h4>
                <p className="mt-1 text-[11px] leading-tight text-ink/70 sm:mt-3 sm:text-base sm:leading-normal">{item.pitchText}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
