import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

/**
 * Homepage section that pairs the "laser at an affordable price" copy with a
 * compact, looping laser video. Plays muted + inline so the browser allows
 * autoplay on mobile.
 */
export async function LaserShowcase() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="container-page">
        <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-gold-dark uppercase">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              {t("laserEyebrow")}
            </p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl">
              {t("laserTitle")}
            </h2>
            <p className="mt-4 max-w-md text-ink/65">{t("laserSubtitle")}</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold px-3 py-1.5 text-xs font-bold tracking-wide text-gold-dark uppercase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("laserHighlight")}
            </span>
          </Reveal>

          <Reveal delay={120} from="right">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border border-ink/10 bg-ink/5 shadow-sm">
              <video
                src="/videos/laser.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={t("laserTitle")}
                className="block aspect-[16/10] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
