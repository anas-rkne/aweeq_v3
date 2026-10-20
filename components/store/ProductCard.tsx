"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Product } from "@/config/store";
import { useCart } from "@/components/cart/CartContext";

/**
 * Product card — the store twin of the homepage collection card: the same
 * gold-on-ink identity, the ribbon tag over the top edge, centered copy and a
 * full-width gold CTA. The CTA adds to the cart inline via the global
 * `cart:added` event (no toast stack).
 */
export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("Store");
  const tAbout = useTranslations("About");
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    const onAdded = (event: Event) => {
      const detail = (event as CustomEvent<{ slug: string }>).detail;
      if (detail?.slug !== product.slug) return;
      setAdded(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAdded(false), 1600);
    };
    window.addEventListener("cart:added", onAdded);
    return () => {
      window.removeEventListener("cart:added", onAdded);
      window.clearTimeout(timer.current);
    };
  }, [product.slug]);

  const name = t(`products.${product.slug}.name`);
  const tag = t(`products.${product.slug}.tag`);
  const summary = tAbout(`perfumes.${product.slug}.summary`);

  return (
    <article className="group relative flex flex-col overflow-visible border border-[#cd9e61]/30 bg-[#0A1128] transition-colors duration-300 ease-out-expo hover:border-[#cd9e61]">
      {/* Ribbon tag — same plate the homepage cards wear */}
      <div className="pointer-events-none absolute inset-x-[-1px] top-0 z-30 -translate-y-[52%]">
        <Image
          src="/images/new_hero/card_tag.png"
          alt=""
          width={400}
          height={120}
          className="h-auto w-full"
        />
      </div>

      <Link
        href={`/store/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#0A1128] pt-12"
        aria-label={name}
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 45vw, 90vw"
          className="object-contain transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col items-center bg-[#0A1128] px-6 pb-6 pt-5 text-center">
        <h3 className="font-primary text-lg font-semibold tracking-wide text-[#cd9e61] md:text-xl">
          {name}
        </h3>
        <p className="mt-1.5 font-secondary text-xs uppercase tracking-[0.2em] text-gold/80 sm:text-sm">
          {tag}
        </p>
        <p className="mt-2 font-secondary text-xs leading-relaxed text-[#f6e6d6]/85 sm:text-sm">
          {summary}
        </p>
        <p className="mt-5 font-secondary text-base text-[#f6e6d6] md:mt-6">
          {formatPrice(product.price)}
          <span className="mr-1 text-small text-[#f6e6d6]/60">{t("currency")}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => add(product.slug)}
        className={`mt-auto inline-flex w-full items-center justify-center py-3.5 text-sm font-medium transition-[color,background-color,transform] duration-press ease-out-expo active:scale-[0.97] ${
          added
            ? "bg-beige text-navy-ink"
            : "bg-[#cd9e61] text-[#081127] hover:bg-beige"
        }`}
      >
        {added && (
          <span key={added ? "on" : "off"} className="pop-in mr-1.5" aria-hidden="true">
            ✓
          </span>
        )}
        {added ? (t("added") ?? "Added") : (t("addToCart") ?? "Add")}
      </button>
    </article>
  );
}
