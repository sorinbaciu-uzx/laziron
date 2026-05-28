"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";

/**
 * Full-bleed hero: the main photos cover the whole hero and cross-fade
 * automatically, with the page content (`children`) overlaid on top. A white
 * left-to-right scrim keeps the dark text legible over any image. Autoplay
 * pauses under `prefers-reduced-motion`; dots allow manual navigation.
 */
export function HeroCarousel({
  images,
  children,
}: {
  images: { src: string; alt: string }[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (images.length <= 1 || reduced) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % images.length),
      5000,
    );
    return () => clearInterval(id);
  }, [images.length, reduced]);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Image layer */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* White scrim for text legibility (keeps the light, no dark overlay) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50 sm:via-white/80 sm:to-transparent"
      />

      {/* Content overlay */}
      <div className="relative">{children}</div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute right-5 bottom-6 z-10 flex gap-2 rounded-full bg-ink/25 px-2.5 py-1.5 backdrop-blur-sm">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-2 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full bg-gold"
      />
    </section>
  );
}
