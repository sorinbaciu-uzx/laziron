import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

/**
 * "Despre noi" story block — eyebrow, heading, slogan-style lead and two body
 * paragraphs. Reused on the About page and on each product detail page (after
 * the "Din China, pentru România" band). When `aside` is passed, it renders in
 * a two-column layout with the aside on the right (e.g. office address card).
 */
export async function AboutStorySection({ aside }: { aside?: ReactNode } = {}) {
  const t = await getTranslations("About");

  const body = (
    <>
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-dark uppercase">
        <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
        {t("eyebrow")}
      </p>
      <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl">
        {t("heading")}
      </h2>
      <p className="mt-5 text-xl leading-snug font-extrabold text-gold-dark sm:text-2xl">
        {t("lead")}
      </p>
      <p className="mt-5 text-base text-ink/70 sm:text-lg">{t("body1")}</p>
      <p className="mt-4 text-ink/70">{t("body2")}</p>
    </>
  );

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-page">
        {aside ? (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Reveal>{body}</Reveal>
            <Reveal delay={120}>{aside}</Reveal>
          </div>
        ) : (
          <Reveal className="max-w-3xl">{body}</Reveal>
        )}
      </div>
    </section>
  );
}
