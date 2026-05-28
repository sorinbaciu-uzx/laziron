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
  product: { name: string; cover: string; series: string };
  label: string;
  className?: string;
}) {
  const t = useTranslations("Quote");
  const tProducts = useTranslations("Products");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} closeLabel={t("close")}>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr]">
          <div className="relative aspect-[4/3] bg-ink/5 sm:aspect-auto sm:min-h-full">
            <Image
              src={product.cover}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="p-5 sm:p-7">
            <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
              {tProducts("seriesLabel")} {product.series}
            </span>
            <h3 className="mt-1.5 text-lg leading-tight font-extrabold text-ink sm:text-xl">
              {t("title")}
            </h3>
            <p className="mt-1 text-sm text-ink/65">{product.name}</p>
            <div className="mt-5">
              <QuoteForm productName={product.name} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
