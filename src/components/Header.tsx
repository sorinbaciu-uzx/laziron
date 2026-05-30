"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PRODUCT_CATEGORIES } from "@/lib/products";

const navItems = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "industrySolutions", href: "/industry-solutions" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const tProducts = useTranslations("Products");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/15 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="LAZIRON"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/brand_no_back.png"
            alt="LAZIRON"
            width={360}
            height={180}
            priority
            quality={95}
            className="h-20 w-auto sm:h-24 lg:h-28"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const linkClasses = `text-sm font-semibold tracking-wide uppercase transition-colors hover:text-gold ${
              isActive(item.href) ? "text-gold" : "text-ink"
            }`;

            // "Produse" gets a hover dropdown with the product categories.
            if (item.key === "products") {
              return (
                <div key={item.key} className="group relative">
                  <Link
                    href={item.href}
                    className={`${linkClasses} inline-flex items-center gap-1`}
                  >
                    {t(item.key)}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  {/* Dropdown panel — `pt-3` is a hover bridge so the cursor
                      can travel from the trigger to the menu without losing it. */}
                  <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="min-w-[18rem] overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl shadow-ink/10">
                      <Link
                        href="/products"
                        className="block border-b border-ink/10 px-4 py-2.5 text-xs font-bold tracking-widest text-gold-dark uppercase transition-colors hover:bg-ink/5"
                      >
                        {t(item.key)} →
                      </Link>
                      <ul className="py-1">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <li key={cat}>
                            <Link
                              href={`/products#${cat}`}
                              className="block px-4 py-2.5 text-sm text-ink/80 transition-colors hover:bg-ink/5 hover:text-gold-dark"
                            >
                              {tProducts(`categories.${cat}`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.key} href={item.href} className={linkClasses}>
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-line/20 text-ink md:hidden"
          >
            <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav className="border-t border-ink-line/15 bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            {navItems.map((item) => (
              <Fragment key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-sm font-semibold tracking-wide uppercase ${
                    isActive(item.href) ? "text-gold" : "text-ink"
                  }`}
                >
                  {t(item.key)}
                </Link>
                {item.key === "products" && (
                  <ul className="mb-2 ml-3 border-l border-ink/10 pl-4">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <li key={cat}>
                        <Link
                          href={`/products#${cat}`}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-sm text-ink/70 hover:text-gold-dark"
                        >
                          {tProducts(`categories.${cat}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            ))}

          </div>
        </nav>
      )}
    </header>
  );
}
