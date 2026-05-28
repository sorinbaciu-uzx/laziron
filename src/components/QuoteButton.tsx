"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Modal } from "./Modal";
import { QuoteForm } from "./QuoteForm";

/**
 * Button that opens a product-specific quote modal. Pass the product context
 * (`name`, `cover`, `series`) and the visible label/styling — the button
 * itself renders as a regular `<button>` styled like a primary CTA, and the
 * modal shows the product image + name beside the quote form.
 */
export function QuoteButton({
  product,
  label,
  className,
}: {
  product: { name: string; cover: string; secondary?: string; series: string };
  label: string;
  className?: string;
}) {
  const t = useTranslations("Quote");
  const tProducts = useTranslations("Products");
  const [open, setOpen] = useState(false);
  const heroImage = product.secondary ?? product.cover;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} closeLabel={t("close")}>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr]">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 sm:aspect-auto sm:min-h-full">
            <Image
              src={heroImage}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 500px, 100vw"
              quality={90}
              className="object-cover object-center"
              priority
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="text-[10px] font-bold tracking-widest text-gold uppercase sm:text-xs">
                {tProducts("seriesLabel")} {product.series}
              </p>
              <p className="mt-1 text-sm font-bold leading-tight text-white sm:text-base">
                {product.name}
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <h3 className="text-lg leading-tight font-extrabold text-ink sm:text-xl">
              {t("title")}
            </h3>
            <div className="mt-5">
              <QuoteForm productName={product.name} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
