import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { HeroCarousel } from "@/components/HeroCarousel";
import { AboutStorySection } from "@/components/AboutStorySection";
import { OfficeAddress } from "@/components/OfficeAddress";
import { OriginSection } from "@/components/OriginSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <>
      <HeroCarousel
        images={[{ src: "/images/contact_main.webp", alt: t("title") }]}
      >
        <div className="container-page flex min-h-[20rem] items-center py-12 sm:min-h-[26rem] sm:py-16 lg:min-h-[30rem]">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {t("lead")}
            </p>
          </div>
        </div>
      </HeroCarousel>

      <section className="py-12 sm:py-16">
        <div className="container-page max-w-2xl">
          <ContactForm />
        </div>
      </section>

      {/* About us story + office address on the right */}
      <AboutStorySection aside={<OfficeAddress />} />

      {/* From China to Romania */}
      <OriginSection />

      {/* Google Maps embed */}
      <section className="bg-white pb-12 sm:pb-20">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=Kerry+Plaza+Tower+2,+Futian+District,+Shenzhen,+Guangdong+518046,+China&output=embed"
              title="Laziron Office — Kerry Plaza Tower 2, Shenzhen"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[20rem] w-full border-0 sm:h-[26rem]"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
