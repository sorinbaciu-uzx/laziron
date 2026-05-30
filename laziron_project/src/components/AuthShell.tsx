import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="container-page relative">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-ink-line/15 bg-white p-5 shadow-xl shadow-ink/5 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-2">
              <span className="dot-pulse h-2 w-2 rounded-full bg-gold" />
              <span className="text-xs font-bold tracking-widest text-gold-dark uppercase">
                LAZIRON
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-ink/70">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
