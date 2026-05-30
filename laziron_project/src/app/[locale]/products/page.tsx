import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductGridCard } from "@/components/ProductGridCard";
import { Reveal } from "@/components/Reveal";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CustomRequestSection } from "@/components/CustomRequestSection";
import { getProductsByCategory } from "@/lib/products";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");
  const groups = getProductsByCategory(locale as Locale);

  return (
    <>
      {/* Header — full-bleed image with title overlaid */}
      <HeroCarousel
        images={[{ src: "/images/produse_main.webp", alt: t("title") }]}
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

      {/* Category quick-nav */}
      {groups.length > 1 && (
        <section className="border-b border-ink/10 bg-white">
          <div className="container-page flex flex-wrap gap-2 py-5">
            {groups.map((group) => (
              <a
                key={group.category}
                href={`#${group.category}`}
                className="rounded-full border border-ink/15 bg-white px-4 py-1.5 text-sm font-semibold text-ink/70 transition-colors hover:border-gold hover:text-gold-dark"
              >
                {t(`categories.${group.category}`)}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <div className="py-12 sm:py-16">
        <div className="container-page space-y-12 sm:space-y-16">
          {groups.length === 0 ? (
            <p className="text-ink/60">{t("empty")}</p>
          ) : (
            groups.map((group) => (
              <section
                key={group.category}
                id={group.category}
                className="scroll-mt-24"
              >
                <Reveal>
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-extrabold text-ink sm:text-2xl lg:text-3xl">
                      {t(`categories.${group.category}`)}
                    </h2>
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="text-sm font-semibold text-ink/40">
                      {group.products.length}
                    </span>
                  </div>
                </Reveal>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                  {group.products.map((product, i) => (
                    <Reveal
                      key={product.id}
                      from="right"
                      delay={(i % 3) * 100}
                      className="h-full"
                    >
                      <ProductGridCard product={product} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Custom request — source a machine we don't list */}
      <CustomRequestSection />
    </>
  );
}
