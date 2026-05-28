import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductDescription } from "@/components/ProductDescription";
import { OriginSection } from "@/components/OriginSection";
import { AboutStorySection } from "@/components/AboutStorySection";
import { QuoteButton } from "@/components/QuoteButton";
import { ProductsCarousel } from "@/components/ProductsCarousel";
import { CustomRequestSection } from "@/components/CustomRequestSection";
import { Reveal } from "@/components/Reveal";
import {
  getLocalizedProduct,
  getProductIds,
  getSimilarProducts,
} from "@/lib/products";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getLocalizedProduct(id, locale as Locale);
  if (!product) return {};
  return {
    title: product.content.name,
    description: product.content.tagline,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = getLocalizedProduct(id, locale as Locale);
  if (!product) notFound();

  const t = await getTranslations("ProductDetail");
  const tCommon = await getTranslations("Common");
  const tProducts = await getTranslations("Products");

  // Wrap tables so they can scroll horizontally on small screens.
  const descriptionHtml = product.content.descriptionHtml
    .replaceAll("<table", '<div class="lzr-table-wrap"><table')
    .replaceAll("</table>", "</table></div>")
    .replaceAll("<a ", '<a target="_blank" rel="noopener noreferrer" ');

  // Title / key-specs block — shown to the right of the secondary image.
  const titleBlock = (
    <div>
      <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
        {tProducts("seriesLabel")} {product.series}
      </span>
      <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl">
        {product.content.name}
      </h1>
      <p className="mt-3 text-sm font-bold tracking-wide text-gold-dark uppercase">
        {t("warrantyBadge")}
      </p>
      <p className="mt-4 text-base text-ink/70 sm:text-lg">{product.content.tagline}</p>
      <div className="mt-7">
        <QuoteButton
          product={{
            name: product.content.name,
            cover: product.cover,
            series: product.series,
          }}
          label={tCommon("requestQuote")}
          className="inline-block rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
        />
      </div>

      {/* Key specs */}
      {product.content.highlights.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold tracking-widest text-ink/40 uppercase">
            {t("keySpecsTitle")}
          </h2>
          <dl className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {product.content.highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3"
              >
                <dt className="text-sm text-ink/50">{h.label}</dt>
                <dd className="text-right text-sm font-semibold text-ink">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Materials */}
      {product.content.applications.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold tracking-widest text-ink/40 uppercase">
            {t("applicationsTitle")}:
          </span>
          {product.content.applications.map((a) => (
            <span
              key={a}
              className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink/75"
            >
              {a}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <article>
      {/* Hero — main image (-1) with the series + product name overlaid at
          the top (a white scrim keeps the dark text legible) */}
      <section className="relative w-full bg-white">
        <div className="relative aspect-[3/2] w-full sm:aspect-[16/9] lg:aspect-[1920/924]">
          <Image
            src={product.cover}
            alt={product.content.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white via-white/75 to-transparent"
          />
          <div className="container-page absolute inset-x-0 top-0 pt-4 sm:pt-10 lg:pt-14">
            <p className="text-[10px] font-semibold tracking-widest text-gold-dark uppercase sm:text-sm">
              {tProducts("seriesLabel")} {product.series}
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-snug font-bold text-ink sm:text-xl lg:text-2xl">
              {(() => {
                const title = product.content.name.split(" — ").pop() ?? "";
                const words = title.split(" ");
                if (words.length > 5) {
                  return (
                    <>
                      {words.slice(0, 5).join(" ")}
                      <br />
                      {words.slice(5).join(" ")}
                    </>
                  );
                }
                return title;
              })()}
            </p>
          </div>
        </div>
        <span className="absolute bottom-0 left-0 h-1 w-full bg-gold" />
      </section>

      {/* Secondary image (-2) left + title / key specs right; full description
          with "read more" below */}
      <section className="bg-white">
        <div className="container-page py-8 sm:py-12">
          <Link
            href="/products"
            className="text-sm font-semibold text-ink/50 transition-colors hover:text-gold"
          >
            ← {tCommon("backToProducts")}
          </Link>

          {product.secondary ? (
            <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Secondary image (left) — stretches to match the text height */}
              <div className="group relative aspect-[4/3] h-full overflow-hidden rounded-2xl border border-ink/10 shadow-lg shadow-ink/5 lg:aspect-auto">
                <Image
                  src={product.secondary}
                  alt={`${product.content.name} — 2`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Title + key specs (right) */}
              <div className="flex flex-col justify-center">{titleBlock}</div>
            </div>
          ) : (
            <div className="mt-6 max-w-3xl">{titleBlock}</div>
          )}

          {/* Full description (collapsible ~10 lines + read more) */}
          <div className="mx-auto mt-10 max-w-4xl sm:mt-14">
            <div className="mb-6 border-b border-ink/10 pb-5 sm:mb-8">
              <p className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
                {t("overviewTitle")}
              </p>
              <h2 className="mt-2 text-xl leading-tight font-extrabold text-ink sm:text-3xl">
                {t("descriptionHeading")}
              </h2>
            </div>
            <ProductDescription html={descriptionHtml} />
          </div>
        </div>
      </section>

      {/* From China to Romania — animated value-proposition band */}
      <OriginSection />

      {/* About / Despre noi — brand story */}
      <AboutStorySection />

      {/* CTA */}
      <section className="pb-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-12">
            <span
              aria-hidden="true"
              className="float-y absolute -top-12 -right-10 h-40 w-40 rounded-full border border-gold/20"
            />
            <span
              aria-hidden="true"
              className="dot-grid absolute bottom-6 left-6 hidden h-20 w-32 opacity-40 sm:block"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-ink">{t("ctaTitle")}</h2>
              <p className="mx-auto mt-3 max-w-xl text-ink/70">{t("ctaText")}</p>
              <QuoteButton
                product={{
                  name: product.content.name,
                  cover: product.cover,
                  series: product.series,
                }}
                label={tCommon("requestQuote")}
                className="mt-6 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Similar products carousel — same category, same look as homepage */}
      {(() => {
        const similar = getSimilarProducts(id, locale as Locale, 8);
        if (similar.length === 0) return null;
        return (
          <section className="bg-white py-20">
            <div className="container-page">
              <Reveal>
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-dark uppercase">
                    <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
                    {tProducts("relatedEyebrow")}
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold text-ink">
                    {tProducts("relatedTitle")}
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={100} className="mt-10">
                <ProductsCarousel products={similar} />
              </Reveal>
            </div>
          </section>
        );
      })()}

      {/* Custom request — source a machine we don't list */}
      <CustomRequestSection />
    </article>
  );
}
