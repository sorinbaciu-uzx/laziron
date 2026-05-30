import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuoteButton } from "./QuoteButton";
import type { LocalizedProduct } from "@/lib/products";

/**
 * Product card used on the catalog page: cover image, series + name, and two
 * actions — "Detalii" (detail page) and "Ofertă" (contact). White, minimalist,
 * with a hover lift and image zoom.
 */
export function ProductGridCard({ product }: { product: LocalizedProduct }) {
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl hover:shadow-gold/10">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-ink/5"
      >
        <Image
          src={product.cover}
          alt={product.content.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <span className="text-[10px] font-semibold tracking-widest text-gold-dark uppercase sm:text-xs">
          {tProducts("seriesLabel")} {product.series}
        </span>
        <h3 className="mt-1.5 text-sm leading-snug font-bold text-ink sm:mt-2 sm:text-lg">
          <Link
            href={`/products/${product.id}`}
            className="transition-colors hover:text-gold-dark"
          >
            {product.content.name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:gap-3 sm:pt-6">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-md border border-ink/20 px-2 py-2 text-center text-xs font-semibold text-ink transition-colors hover:border-gold hover:text-gold-dark sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {tCommon("details")}
          </Link>
          <QuoteButton
            product={{
              name: product.content.name,
              cover: product.cover,
              secondary: product.secondary,
              series: product.series,
            }}
            label={tCommon("offer")}
            className="flex-1 rounded-md bg-gold px-2 py-2 text-center text-xs font-semibold text-ink transition-colors hover:bg-gold-dark sm:px-4 sm:py-2.5 sm:text-sm"
          />
        </div>
      </div>
    </article>
  );
}
