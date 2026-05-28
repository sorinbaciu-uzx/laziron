import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductsCarousel } from "@/components/ProductsCarousel";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LaserShowcase } from "@/components/LaserShowcase";
import { OriginSection } from "@/components/OriginSection";
import { CustomRequestSection } from "@/components/CustomRequestSection";
import { Reveal } from "@/components/Reveal";
import { getFeaturedProducts, getLocalizedProducts } from "@/lib/products";
import type { Locale } from "@/i18n/routing";

const featureKeys = [1, 2, 3, 4] as const;
const appKeys = [1, 2, 3, 4, 5, 6] as const;

// Simple, consistent line icons for the recommended-applications grid.
const appIcons = [
  // Automotive
  <path
    key="i"
    d="M3 13l2-5h14l2 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3v-5zM6 13h12"
  />,
  // Metal construction
  <path key="i" d="M4 21V4h10v17M14 21V9h6v12M3 21h18M7 8h3M7 12h3" />,
  // Metal furniture
  <path
    key="i"
    d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9"
  />,
  // Agricultural equipment
  <path
    key="i"
    d="M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"
  />,
  // Signage & design
  <path key="i" d="M4 13l7-7 9 9-7 7-9-9zM8 9h.01" />,
  // Subcontracting
  <path key="i" d="M12 3l8 4-8 4-8-4 8-4zM4 11l8 4 8-4M4 15l8 4 8-4" />,
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");
  const tIndustry = await getTranslations("Industry");

  const featured = getFeaturedProducts(locale as Locale);
  const products = featured.length
    ? featured
    : getLocalizedProducts(locale as Locale);
  // Hero rotates through the main photos in public/images.
  const heroImages = [
    { src: "/images/main1.webp", alt: t("heroTitle") },
    { src: "/images/main2.webp", alt: t("heroTitle") },
    { src: "/images/main3.webp", alt: t("heroTitle") },
  ];

  return (
    <>
      {/* Hero — full-bleed rotating photos with overlaid text */}
      <HeroCarousel images={heroImages}>
        <div className="container-page flex min-h-[26rem] items-center py-14 sm:min-h-[34rem] sm:py-20 lg:min-h-[42rem]">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-gold-dark uppercase">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] text-ink sm:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink/70 sm:text-lg">
              {t("heroSubtitle")}
            </p>
            <p className="mt-4 text-base font-bold text-gold-dark sm:text-lg">
              {t("heroTagline")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
              >
                {t("heroCtaPrimary")}
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-ink/20 bg-white/70 px-6 py-3 font-semibold text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-dark"
              >
                {t("heroCtaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </HeroCarousel>

      {/* Our products — carousel */}
      <section className="bg-white py-12 sm:py-20">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                  {t("productsTitle")}
                </h2>
                <p className="mt-3 text-ink/65">{t("productsSubtitle")}</p>
              </div>
              <Link
                href="/products"
                className="rounded-md border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold-dark"
              >
                {tCommon("viewAllProducts")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <ProductsCarousel products={products} />
          </Reveal>
        </div>
      </section>

      {/* Laser in action — animated showcase */}
      <LaserShowcase />

      {/* From China to Romania — value proposition band */}
      <OriginSection />

      {/* About us + best-price offer */}
      <section className="relative overflow-hidden border-y border-ink/10 bg-white py-12 sm:py-20">
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute top-8 right-8 hidden h-32 w-48 opacity-40 lg:block"
        />
        <div className="container-page relative">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-gold-dark uppercase">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              {t("aboutEyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              {t("aboutTitle")}
            </h2>
            <p className="mt-5 text-lg text-ink/70">{t("aboutText")}</p>
          </Reveal>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
            {/* Why us */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {featureKeys.map((n, i) => (
                <Reveal key={n} delay={i * 90}>
                  <div className="group h-full rounded-xl border border-ink/10 bg-white p-4 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/10 sm:p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/40 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-ink">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-ink sm:text-base">
                      {t(`feature${n}Title`)}
                    </h3>
                    <p className="mt-2 text-xs text-ink/65 sm:text-sm">
                      {t(`feature${n}Desc`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Best-price offer */}
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-white p-8 shadow-lg shadow-gold/10">
                <span
                  aria-hidden="true"
                  className="float-y absolute -top-10 -right-10 h-32 w-32 rounded-full border border-gold/30"
                />
                <span className="relative inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase">
                  {t("offerBadge")}
                </span>
                <h3 className="relative mt-4 text-2xl font-extrabold text-ink">
                  {t("offerTitle")}
                </h3>
                <p className="relative mt-3 text-ink/70">{t("offerText")}</p>
                <Link
                  href="/contact"
                  className="relative mt-6 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
                >
                  {tCommon("contactUs")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Recommended applications */}
      <section className="bg-white py-12 sm:py-20">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                  {t("applicationsTitle")}
                </h2>
                <p className="mt-3 text-ink/65">{t("applicationsSubtitle")}</p>
              </div>
              <Link
                href="/industry-solutions"
                className="rounded-md border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold-dark"
              >
                {t("applicationsCta")} →
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-3">
            {appKeys.map((n, i) => (
              <Reveal key={n} delay={(i % 3) * 90}>
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
                      {appIcons[i]}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink sm:text-base">
                      {tIndustry(`item${n}Title`)}
                    </h3>
                    <p className="mt-1 text-xs text-ink/65 sm:text-sm">
                      {tIndustry(`item${n}Desc`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom request — source a machine we don't list */}
      <CustomRequestSection />

      {/* CTA */}
      <section className="bg-white pb-12 sm:pb-20">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-14">
              <span
                aria-hidden="true"
                className="float-y absolute -top-12 -left-10 h-40 w-40 rounded-full border border-gold/20"
              />
              <span
                aria-hidden="true"
                className="dot-grid absolute right-6 bottom-6 hidden h-20 w-32 opacity-40 sm:block"
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
                  {tCommon("contactUs")}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
