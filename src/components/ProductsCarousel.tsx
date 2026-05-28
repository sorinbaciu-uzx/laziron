"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { LocalizedProduct } from "@/lib/products";

/**
 * Horizontal, swipeable carousel of product cards. Auto-scrolls on its own
 * (pausing on hover, focus or touch) and offers prev/next controls. Gracefully
 * handles a single product (centered, no movement). Respects reduced motion.
 */
export function ProductsCarousel({
  products,
}: {
  products: LocalizedProduct[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);

  const single = products.length === 1;

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  // Continuous, smooth auto-scroll to the left (track scrollLeft increases),
  // pixels-per-second based so the speed is the same on every frame rate.
  // Pauses on hover/focus/touch; loops back to the start at the end.
  useEffect(() => {
    if (single || reduced || paused) return;
    let raf = 0;
    let last = performance.now();
    const SPEED = 45; // pixels / second
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const el = trackRef.current;
      if (el) {
        el.scrollLeft += SPEED * dt;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [single, reduced, paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        className={`flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          single ? "justify-center" : "snap-x snap-mandatory"
        }`}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-card
            className={`shrink-0 snap-start ${
              single ? "w-full max-w-sm" : "w-[82%] sm:w-80 lg:w-[22rem]"
            }`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {!single && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="‹"
            className="absolute top-1/2 left-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white/95 text-ink shadow-md backdrop-blur transition-all hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-0 sm:-left-3 sm:h-11 sm:w-11 sm:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="›"
            className="absolute top-1/2 right-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white/95 text-ink shadow-md backdrop-blur transition-all hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-0 sm:-right-3 sm:h-11 sm:w-11 sm:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
