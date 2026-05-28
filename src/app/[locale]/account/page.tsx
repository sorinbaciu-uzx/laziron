import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/auth";
import { findUserById } from "@/lib/users";
import { LogoutButton } from "@/components/LogoutButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return { title: t("accountTitle") };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) {
    redirect({ href: { pathname: "/login", query: { callbackUrl: "/account" } }, locale });
    return null;
  }

  const userId = Number(session.user.id);
  const user = Number.isFinite(userId) ? await findUserById(userId) : null;

  const t = await getTranslations("Auth");

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-ink-line/15 bg-white p-6 shadow-xl shadow-ink/5 sm:p-10">
            <div className="mb-6 flex items-center gap-2">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">
                LAZIRON
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {t("accountTitle")}
            </h1>
            <p className="mt-2 text-sm text-ink/70">{t("accountSubtitle")}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-white p-4">
                <dt className="text-xs font-semibold tracking-widest text-ink/45 uppercase">
                  {t("accountName")}
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {user.name ?? "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white p-4">
                <dt className="text-xs font-semibold tracking-widest text-ink/45 uppercase">
                  {t("accountEmail")}
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink break-all">
                  {user.email}
                </dd>
              </div>
              <div className="rounded-xl border border-ink/10 bg-white p-4 sm:col-span-2">
                <dt className="text-xs font-semibold tracking-widest text-ink/45 uppercase">
                  {t("accountCreatedAt")}
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {user.createdAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
