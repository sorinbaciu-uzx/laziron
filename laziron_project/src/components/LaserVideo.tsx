type Variant = 1 | 2 | 3 | 4;

/**
 * Compact, looping laser video card. Used on the industry-solutions timeline
 * in place of the drawn SVG animation. Plays muted + looped + inline so the
 * browser allows autoplay on mobile. `preload="metadata"` keeps the initial
 * payload small (only the few KB the browser needs to start playback).
 */
export function LaserVideo({
  variant,
  label,
}: {
  variant: Variant;
  label?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-ink/10 bg-ink/5 shadow-sm">
      <video
        src={`/videos/${variant}laser.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="block aspect-[16/10] w-full object-cover"
      />
    </div>
  );
}
