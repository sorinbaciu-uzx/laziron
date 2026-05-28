import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="container-page flex flex-col items-center justify-center py-24 text-center sm:py-32">
      <p className="text-6xl font-extrabold text-gold sm:text-7xl">404</p>
      <h1 className="mt-4 text-xl font-bold text-ink sm:text-2xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink/65 sm:text-base">
        {t("description")}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-gold px-6 py-3 font-semibold text-ink transition-colors hover:bg-gold-dark"
      >
        ← {t("back")}
      </Link>
    </section>
  );
}
