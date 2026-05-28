import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PRODUCT_CATEGORIES } from "@/lib/products";

const legalBadges = [
  {
    src: "/images/anpc.webp",
    alt: "ANPC — Soluționarea Alternativă a Litigiilor",
    href: "https://anpc.ro/ce-este-sal/",
  },
  {
    src: "/images/sol.webp",
    alt: "SOL — Soluționarea Online a Litigiilor",
    href: "https://consumer-redress.ec.europa.eu/site-relocation_en",
  },
] as const;

const navItems = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "industrySolutions", href: "/industry-solutions" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

const legalLinks = [
  { slug: "privacy", href: "/privacy" },
  { slug: "terms", href: "/terms" },
  { slug: "cookies", href: "/cookies" },
  { slug: "returns", href: "/returns" },
  { slug: "shipping", href: "/shipping" },
  { slug: "warranty", href: "/warranty" },
] as const;

export function Footer() {
  const tNav = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const tProducts = useTranslations("Products");
  const tAbout = useTranslations("About");
  const tLegal = useTranslations("Legal");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t-2 border-gold bg-white">
      {/* Subtle decorative shapes */}
      <span
        aria-hidden="true"
        className="float-y pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full border border-gold/20"
      />
      <span
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute bottom-16 left-6 hidden h-24 w-40 opacity-40 lg:block"
      />

      <div className="container-page relative py-10 sm:py-14">
        <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-12">
          {/* Brand (logo already contains the tagline; no duplicate text) */}
          <div className="lg:col-span-4">
            <Image
              src="/images/brand_no_back.png"
              alt="LAZIRON — Calitate industrială la preț accesibil"
              width={520}
              height={260}
              quality={95}
              className="h-20 w-auto sm:h-28 lg:h-32"
            />
            <div className="mt-6 flex flex-col items-start gap-4 sm:pl-8">
              {legalBadges.map((badge) => (
                <a
                  key={badge.href}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={badge.alt}
                  className="inline-block transition-opacity hover:opacity-80"
                >
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={220}
                    height={80}
                    className="h-12 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="lg:col-span-2" aria-label={tFooter("navTitle")}>
            <h3 className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
              {tFooter("navTitle")}
            </h3>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink/75 transition-colors hover:text-gold-dark"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Product categories — deep-link into /products */}
          <nav className="lg:col-span-3" aria-label={tFooter("categoriesTitle")}>
            <h3 className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
              {tFooter("categoriesTitle")}
            </h3>
            <ul className="mt-5 space-y-3">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products#${cat}`}
                    className="text-sm text-ink/75 transition-colors hover:text-gold-dark"
                  >
                    {tProducts(`categories.${cat}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Office address */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
              {tAbout("officeTitle")}
            </h3>
            <p className="mt-5 text-sm font-bold text-ink">Laziron Office</p>
            <address className="mt-1 text-sm leading-relaxed text-ink/70 not-italic">
              Kerry Plaza Tower 2<br />
              No. 1 Zhong Xin Fourth Road<br />
              Futian District, Shenzhen<br />
              Guangdong 518046<br />
              China
            </address>
          </div>
        </div>
      </div>

      <div className="relative border-t border-ink/10 bg-white">
        <div className="container-page py-6">
          <nav
            aria-label={tFooter("legalTitle")}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.slug}
                href={link.href}
                className="text-ink/65 transition-colors hover:text-gold-dark"
              >
                {tLegal(`${link.slug}.linkLabel`)}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-center text-xs text-ink/55">
            &copy; {year} LAZIRON. {tFooter("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
