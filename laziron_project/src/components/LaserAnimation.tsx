import type { CSSProperties, ReactNode } from "react";

type Variant = 1 | 2 | 3 | 4;

/**
 * Reusable, drawn (SVG) laser animation card with 4 variants — one per major
 * action a fiber laser performs: sheet cutting, tube cutting, welding and
 * cleaning. Each variant keeps the same head/beam/sparks but swaps the
 * workpiece and the "drawn" gold elements. Pure CSS; respects reduced motion.
 */
const scenes: Record<Variant, ReactNode> = {
  // 1 — Sheet cutting: a flat sheet with a part and a circular hole drawing.
  1: (
    <>
      <rect
        x="44"
        y="158"
        width="392"
        height="104"
        rx="7"
        fill="color-mix(in srgb, var(--color-ink) 4%, white)"
        stroke="color-mix(in srgb, var(--color-ink) 16%, white)"
        strokeWidth="1.5"
      />
      <path
        className="cut-draw"
        d="M84 176 H150 Q166 176 166 192 V238 Q166 250 154 250 H84 Q72 250 72 238 V188 Q72 176 84 176 Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2"
        strokeLinejoin="round"
        pathLength={100}
      />
      <circle
        className="cut-draw"
        style={{ animationDelay: "1s" }}
        cx="268"
        cy="212"
        r="30"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2"
        pathLength={100}
      />
    </>
  ),

  // 2 — Tube cutting: a horizontal pipe with a series of holes/slots being cut.
  2: (
    <>
      <rect
        x="60"
        y="200"
        width="360"
        height="42"
        rx="21"
        fill="color-mix(in srgb, var(--color-ink) 5%, white)"
        stroke="color-mix(in srgb, var(--color-ink) 18%, white)"
        strokeWidth="1.5"
      />
      {/* end-cap hint */}
      <line x1="78" y1="208" x2="78" y2="234" stroke="color-mix(in srgb, var(--color-ink) 16%, white)" strokeWidth="1" />
      <line x1="402" y1="208" x2="402" y2="234" stroke="color-mix(in srgb, var(--color-ink) 16%, white)" strokeWidth="1" />
      <circle className="cut-draw" cx="130" cy="221" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="2" pathLength={100} />
      <circle className="cut-draw" style={{ animationDelay: "0.4s" }} cx="180" cy="221" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="2" pathLength={100} />
      <circle className="cut-draw" style={{ animationDelay: "0.8s" }} cx="230" cy="221" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="2" pathLength={100} />
      <circle className="cut-draw" style={{ animationDelay: "1.2s" }} cx="280" cy="221" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="2" pathLength={100} />
      <path
        className="cut-draw"
        style={{ animationDelay: "1.6s" }}
        d="M320 211 H380 V231 H320 Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2"
        strokeLinejoin="round"
        pathLength={100}
      />
    </>
  ),

  // 3 — Welding: two plates joined by a glowing bead drawn along the seam.
  3: (
    <>
      <rect x="44" y="190" width="178" height="68" rx="4" fill="color-mix(in srgb, var(--color-ink) 4%, white)" stroke="color-mix(in srgb, var(--color-ink) 16%, white)" strokeWidth="1.5" />
      <rect x="234" y="190" width="200" height="68" rx="4" fill="color-mix(in srgb, var(--color-ink) 4%, white)" stroke="color-mix(in srgb, var(--color-ink) 16%, white)" strokeWidth="1.5" />
      <line
        className="cut-draw"
        x1="48"
        y1="224"
        x2="430"
        y2="224"
        stroke="var(--color-gold)"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
      />
    </>
  ),

  // 4 — Cleaning: a darker, "dirty" surface with a clean white stripe drawing
  // across as the laser passes.
  4: (
    <>
      <rect x="60" y="190" width="360" height="68" rx="4" fill="color-mix(in srgb, var(--color-ink) 22%, white)" stroke="color-mix(in srgb, var(--color-ink) 30%, white)" strokeWidth="1.5" />
      <line
        className="cut-draw"
        style={{ filter: "none" }}
        x1="64"
        y1="224"
        x2="416"
        y2="224"
        stroke="white"
        strokeWidth="18"
        strokeLinecap="round"
        pathLength={100}
      />
      {/* faint dirt residue */}
      <circle cx="100" cy="210" r="2" fill="color-mix(in srgb, var(--color-ink) 35%, white)" />
      <circle cx="200" cy="210" r="1.5" fill="color-mix(in srgb, var(--color-ink) 35%, white)" />
      <circle cx="320" cy="244" r="2" fill="color-mix(in srgb, var(--color-ink) 35%, white)" />
      <circle cx="380" cy="245" r="1.5" fill="color-mix(in srgb, var(--color-ink) 35%, white)" />
    </>
  ),
};

export function LaserAnimation({
  variant = 1,
  label,
}: {
  variant?: Variant;
  label?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
      <span
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <svg
        viewBox="0 0 480 300"
        className="relative w-full"
        role="img"
        aria-label={label}
      >
        {/* Gantry rail */}
        <rect
          x="28"
          y="44"
          width="424"
          height="9"
          rx="3"
          fill="color-mix(in srgb, var(--color-ink) 9%, white)"
          stroke="color-mix(in srgb, var(--color-ink) 16%, white)"
        />
        {/* Workpiece + drawn cuts/beads for the chosen variant */}
        {scenes[variant]}
        {/* Head + beam (shared across variants, sweeps left-right) */}
        <g
          className="laser-head-anim"
          style={{ "--sweep": "250px" } as CSSProperties}
        >
          <line
            className="laser-beam-anim"
            x1="104"
            y1="96"
            x2="104"
            y2="205"
            stroke="var(--color-gold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="laser-spark">
            <circle cx="104" cy="205" r="3" fill="var(--color-gold)" />
            <line x1="104" y1="205" x2="97" y2="213" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="104" y1="205" x2="111" y2="214" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
          <rect
            x="88"
            y="56"
            width="32"
            height="34"
            rx="5"
            fill="white"
            stroke="color-mix(in srgb, var(--color-ink) 28%, white)"
            strokeWidth="1.5"
          />
          <rect x="93" y="61" width="22" height="7" rx="2" fill="var(--color-gold)" />
          <path d="M99 90 H109 L106 102 H102 Z" fill="color-mix(in srgb, var(--color-ink) 50%, white)" />
        </g>
      </svg>
    </div>
  );
}
