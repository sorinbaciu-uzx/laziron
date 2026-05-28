import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

/**
 * "Custom request" band: if a customer doesn't find what they need on the
 * site, they fill the form and we source the equipment. White card with a
 * bold gold border and a floating accent shape. Reused on the home page and
 * the industry-solutions page.
 */
export async function CustomRequestSection() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-white pb-12 sm:pb-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border-2 border-gold/60 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="float-y absolute -top-10 -right-10 h-36 w-36 rounded-full border border-gold/25"
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-dark uppercase">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 text-gold-dark">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </span>
                  {t("customEyebrow")}
                </p>
                <h2 className="mt-4 text-xl font-extrabold leading-tight text-ink sm:text-2xl lg:text-3xl">
                  {t("customTitle")}
                </h2>
                <p className="mt-3 text-ink/70">{t("customText")}</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 rounded-md bg-gold px-7 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
              >
                {t("customCta")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
