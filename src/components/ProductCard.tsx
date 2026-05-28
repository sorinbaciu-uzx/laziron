import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuoteButton } from "./QuoteButton";
import type { LocalizedProduct } from "@/lib/products";

export function ProductCard({ product }: { product: LocalizedProduct }) {
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink-line/12 bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-ink/5"
      >
        <Image
          src={product.cover}
          alt={product.content.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={product.cover.endsWith(".svg")}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold tracking-widest text-gold uppercase">
          {tProducts("seriesLabel")} {product.series}
        </span>
        <h3 className="mt-2 text-lg font-bold text-ink">
          {product.content.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink/65">
          {product.content.tagline}
        </p>

        <div className="mt-4 flex items-center gap-4 pt-1">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-semibold text-ink underline-offset-4 hover:text-gold hover:underline"
          >
            {tCommon("learnMore")} →
          </Link>
          <QuoteButton
            product={{
              name: product.content.name,
              cover: product.cover,
              series: product.series,
            }}
            label={tCommon("requestQuote")}
            className="ml-auto rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-dark"
          />
        </div>
      </div>
    </article>
  );
}
