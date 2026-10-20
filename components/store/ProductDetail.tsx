"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Product } from "@/config/store";
import { useCart } from "@/components/cart/CartContext";

/**
 * Product detail — story, notes pyramid, size, quantity stepper and add-to-cart
 * for one civilization (MASTER-PLAN §6.8 / store-plan v2). Description, notes
 * and price are always visible; the quantity is a real stepper.
 */
export default function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("Store");
  const tAbout = useTranslations("About");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { add } = useCart();
  const [qty, setQty] = useState(1);
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
  const story = t(`products.${product.slug}.story`);
  const notesTop = t(`products.${product.slug}.notesTop`);
  const notesHeart = t(`products.${product.slug}.notesHeart`);
  const notesBase = t(`products.${product.slug}.notesBase`);
  const summary = tAbout(`perfumes.${product.slug}.summary`);

  return (
    <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
      {/* Visual */}
      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-beige/10 bg-navy-deep">
          <Image
            src={product.image}
            alt={name}
            fill
            priority
            sizes="(min-width: 64rem) 45vw, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />
        </div>
        <Link
          href="/store"
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-beige/20 bg-navy-ink/70 px-4 py-2 text-micro text-beige backdrop-blur transition-colors hover:border-gold"
        >
          <span aria-hidden="true">←</span> {t("backToStore")}
        </Link>
      </div>

      {/* Detail */}
      <div dir={isArabic ? "rtl" : "ltr"}>
        <p className="font-secondary text-small tracking-[0.35em] text-gold">{tag}</p>
        <h1 className="mt-3 font-primary text-display leading-[1.08] text-beige">{name}</h1>
        <p className="mt-3 text-body text-beige/70">{summary}</p>

        <p className="mt-6 max-w-prose whitespace-pre-line text-body leading-relaxed text-beige/85">
          {story}
        </p>

        {/* Notes pyramid */}
        <dl className="mt-8 grid gap-3">
          <NoteRow label={t("notesTop")} value={notesTop} />
          <NoteRow label={t("notesHeart")} value={notesHeart} />
          <NoteRow label={t("notesBase")} value={notesBase} />
        </dl>

        <p className="mt-6 text-small text-beige/60">
          {t("size")}: {product.sizeMl} {t("ml")}
        </p>

        <div className="mt-6 flex items-end justify-between gap-6">
          <p className="font-secondary text-display tabular-nums leading-none text-beige">
            {formatPrice(product.price)}
            <span className="mr-2 text-h3 text-beige/60">{t("currency")}</span>
          </p>
          <p className="text-micro text-beige/60">
            {t("shippingNote", { amount: formatPrice(500) })}
          </p>
        </div>

        {/* Quantity + add */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-beige/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={t("decrease")}
              className="flex h-12 w-12 items-center justify-center text-beige transition-transform duration-press ease-out-expo active:scale-[0.88]"
            >
              −
            </button>
            <span
              key={qty}
              className="pop-in w-10 text-center text-body tabular-nums text-beige"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label={t("increase")}
              className="flex h-12 w-12 items-center justify-center text-beige transition-transform duration-press ease-out-expo active:scale-[0.88]"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => add(product.slug, qty)}
            className={`inline-flex flex-1 items-center justify-center rounded-full px-8 py-3.5 text-small font-medium transition-[color,background-color,transform] duration-press ease-out-expo active:scale-[0.98] ${
              added ? "bg-beige text-navy-ink" : "bg-gold text-navy-ink hover:bg-beige"
            }`}
          >
            {added && (
              <span className="pop-in mr-1.5" aria-hidden="true">
                ✓
              </span>
            )}
            {added ? t("added") : t("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-beige/10 pb-3">
      <dt className="shrink-0 text-small font-medium text-gold">{label}</dt>
      <dd className="text-right text-small text-beige/80">{value}</dd>
    </div>
  );
}
