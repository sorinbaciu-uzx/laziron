import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Reveal } from "@/components/Reveal";
import { LaserVideo } from "@/components/LaserVideo";
import { LaserTimeline } from "@/components/LaserTimeline";
import { OriginSection } from "@/components/OriginSection";
import { CustomRequestSection } from "@/components/CustomRequestSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Industry" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const itemKeys = [1, 2, 3, 4, 5, 6] as const;

export default async function IndustrySolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Industry");

  return (
    <>
      <HeroCarousel
        images={[{ src: "/images/solutii.webp", alt: t("title") }]}
      >
        <div className="container-page flex min-h-[20rem] items-center py-12 sm:min-h-[24rem] sm:py-16 lg:min-h-[28rem]">
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base text-ink/70 sm:text-lg">{t("subtitle")}</p>
          </div>
        </div>
      </HeroCarousel>

      <section className="py-12 sm:py-16">
        <div className="container-page grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {itemKeys.map((n) => (
            <div
              key={n}
              className="rounded-xl border border-ink-line/12 p-4 transition-colors hover:border-gold sm:p-6"
            >
              <h2 className="text-sm font-bold text-ink sm:text-lg">{t(`item${n}Title`)}</h2>
              <p className="mt-2 text-xs text-ink/65 sm:text-sm">{t(`item${n}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Laser actions — 4 drawn animations on a vertical timeline; dots turn
          gold as each animation scrolls into view */}
      <section className="overflow-hidden bg-white pb-16 sm:pb-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-gold-dark uppercase">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              {t("laserEyebrow")}
            </p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl">
              {t("laserTitle")}
            </h2>
            <p className="mt-3 text-ink/65">{t("laserSubtitle")}</p>
          </Reveal>

          <div className="mt-14">
            <LaserTimeline
              pitchEyebrow={t("laserPitchEyebrow")}
              items={[1, 2, 3, 4].map((n) => ({
                title: t(`laserAnim${n}Title`),
                desc: t(`laserAnim${n}Desc`),
                pitchTitle: t(`laserPitch${n}Title`),
                pitchText: t(`laserPitch${n}Text`),
                anim: (
                  <LaserVideo
                    variant={n as 1 | 2 | 3 | 4}
                    label={t(`laserAnim${n}Title`)}
                  />
                ),
              }))}
            />
          </div>
        </div>
      </section>

      {/* From China to Romania — value proposition band */}
      <OriginSection />

      {/* Custom request — source a machine we don't list */}
      <CustomRequestSection />
    </>
  );
}
