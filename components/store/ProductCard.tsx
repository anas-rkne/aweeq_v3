"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Product } from "@/config/store";
import { useCart } from "@/components/cart/CartContext";

/**
 * Product card — the product is the hero of the card (Palmo §scene 8). Name,
 * tag and description are ALWAYS visible (MASTER-PLAN §6.4 / §11: no info
 * behind hover), price is shown, and adding to the cart confirms inline via the
 * global `cart:added` event (no toast stack).
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-beige/10 bg-navy-deep transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-beige/25">
      <Link
        href={`/store/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden"
        aria-label={name}
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 h-10 w-10 rounded-full opacity-80"
          style={{ backgroundColor: product.accent }}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-primary text-h3 text-beige">{name}</h3>
          <p className="mt-1 text-small text-gold">{tag}</p>
        </div>
        <p className="text-small leading-relaxed text-beige/70">{summary}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <div>
            <p className="text-micro text-beige/50">{t("from")}</p>
            <p className="font-secondary text-h3 tabular-nums text-beige">
              {formatPrice(product.price)}
              <span className="mr-1 text-small text-beige/60">{t("currency")}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => add(product.slug)}
            className={`inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-small font-medium transition-[color,background-color,transform] duration-press ease-out-expo active:scale-[0.97] ${
              added
                ? "bg-beige text-navy-ink"
                : "bg-gold text-navy-ink hover:bg-beige"
            }`}
          >
            {added && (
              <span key={added ? "on" : "off"} className="pop-in mr-1.5" aria-hidden="true">
                ✓
              </span>
            )}
            {added ? (t("added") ?? "Added") : (t("addToCart") ?? "Add")}
          </button>
        </div>
      </div>
    </article>
  );
}
