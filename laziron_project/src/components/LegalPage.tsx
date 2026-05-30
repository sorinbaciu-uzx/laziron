import { getTranslations } from "next-intl/server";
import { HeroCarousel } from "./HeroCarousel";
import { Reveal } from "./Reveal";

export type LegalSlug =
  | "privacy"
  | "terms"
  | "cookies"
  | "returns"
  | "shipping"
  | "warranty";

type Section = { heading: string; body: string };

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const t = await getTranslations("Legal");
  const sections = t.raw(`${slug}.sections`) as Section[];
  const title = t(`${slug}.title`);

  return (
    <>
      <HeroCarousel
        images={[{ src: "/images/politici.webp", alt: title }]}
      >
        <div className="container-page flex min-h-[18rem] items-center py-12 sm:min-h-[22rem] sm:py-16 lg:min-h-[26rem]">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {t(`${slug}.lead`)}
            </p>
          </div>
        </div>
      </HeroCarousel>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <ol className="space-y-8 sm:space-y-12">
              {sections.map((s, i) => (
                <Reveal key={i} delay={i * 60}>
                  <li className="border-l-4 border-gold pl-4 sm:pl-6">
                    <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg font-bold text-ink sm:text-2xl">
                      <span className="font-mono text-sm text-gold-dark sm:text-base">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {s.heading}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
                      {s.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
