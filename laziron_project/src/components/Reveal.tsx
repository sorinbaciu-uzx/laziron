"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps content in a fade + slide that plays once the element scrolls into
 * view. `from` picks the slide direction ("bottom" default, or "right").
 * `delay` (ms) lets callers stagger a row of items. Motion is disabled under
 * `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden =
    from === "right" ? "translate-x-10 opacity-0" : "translate-y-6 opacity-0";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : hidden
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
