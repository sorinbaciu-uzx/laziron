import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { OriginSection } from "@/components/OriginSection";
import { AboutStorySection } from "@/components/AboutStorySection";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OfficeAddress } from "@/components/OfficeAddress";

const points = [1, 2, 3, 4, 5, 6] as const;

// Simple line icons for the trust points.
const pointIcons = [
  // Team
  <path
    key="i"
    d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9 8a3 3 0 100-6 3 3 0 000 6M21 20v-2a3 3 0 00-2.2-2.9"
  />,
  // Support
  <path
    key="i"
    d="M4 13v-1a8 8 0 0116 0v1M4 13a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 13a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 19a3 3 0 01-3 2h-2"
  />,
  // Shield (warranty)
  <path key="i" d="M12 3l8 3v5c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6l8-3zM9 12l2 2 4-4" />,
  // Eye (inspection)
  <path
    key="i"
    d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6zM12 9a3 3 0 100 6 3 3 0 000-6z"
  />,
  // Certificate (CE)
  <path
    key="i"
    d="M12 14a5 5 0 100-10 5 5 0 000 10zM9 13l-1 8 4-2 4 2-1-8M10.5 9l1 1 2.5-2.5"
  />,
  // Tag (price)
  <path key="i" d="M4 13l7-7 9 9-7 7-9-9zM8 9h.01" />,
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const tCommon = await getTranslations("Common");

  return (
    <>
      {/* Header — full-bleed image with title overlaid */}
      <HeroCarousel
        images={[{ src: "/images/desprenoi.webp", alt: t("title") }]}
      >
        <div className="container-page flex min-h-[20rem] items-center py-12 sm:min-h-[24rem] sm:py-16 lg:min-h-[28rem]">
          <div className="max-w-xl">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base text-ink/70 sm:text-lg">{t("subtitle")}</p>
            <p className="mt-3 text-base font-bold text-gold-dark sm:text-lg">
              {(() => {
                const [first, ...rest] = t("subtitleTagline").split(". ");
                if (rest.length === 0) return first;
                return (
                  <>
                    {first}.
                    <br />
                    {rest.join(". ")}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
      </HeroCarousel>

      {/* Story + office address */}
      <AboutStorySection aside={<OfficeAddress />} />

      {/* From China to Romania — value proposition band */}
      <OriginSection />

      {/* Trust points */}
      <section className="border-y border-ink/10 bg-white py-12 sm:py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {points.map((n, i) => (
              <Reveal key={n} delay={(i % 3) * 90} className="h-full">
                <div className="group flex h-full flex-col gap-3 rounded-xl border border-ink/10 bg-white p-4 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10 sm:flex-row sm:gap-4 sm:p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/40 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-ink sm:h-12 sm:w-12">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {pointIcons[i]}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink sm:text-base">{t(`point${n}Title`)}</h3>
                    <p className="mt-1 text-xs text-ink/65 sm:text-sm">
                      {t(`point${n}Desc`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-14">
              <span
                aria-hidden="true"
                className="float-y absolute -top-12 -right-10 h-40 w-40 rounded-full border border-gold/20"
              />
              <div className="relative">
                <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                  {t("ctaTitle")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-ink/70">
                  {t("ctaText")}
                </p>
                <Link
                  href="/contact"
                  className="mt-7 inline-block rounded-md bg-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
                >
                  {tCommon("requestQuote")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
