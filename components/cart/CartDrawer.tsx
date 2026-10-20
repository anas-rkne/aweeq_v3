"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  getProduct,
} from "@/config/store";
import { useCart } from "./CartContext";
import { useLenis } from "@/providers/SmoothScroll";

/**
 * Cart drawer — a right-hand panel (left in RTL) that slides in over the page.
 * Follows the same accessibility contract as the menu overlay: focus trap,
 * Escape to close, scroll lock (via Lenis or body overflow), aria-modal.
 */
export default function CartDrawer() {
  const t = useTranslations("Store.cart");
  const tCart = useTranslations("Cart");
  const tStore = useTranslations("Store");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { lines, subtotal, isOpen, closeCart, setQty, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      if (!lenis) document.body.style.overflow = "hidden";
      const first = panelRef.current?.querySelector<HTMLElement>(
        "button, a[href], input"
      );
      first?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, lenis]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeCart();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        "button, a[href], input, [tabindex]:not([tabindex='-1'])"
      )
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      inert={!isOpen}
      onKeyDown={onKeyDown}
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Scrim */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-navy-ink/60 backdrop-blur-sm transition-opacity duration-300 ease-out-expo ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`absolute top-0 flex h-full w-full max-w-md flex-col border-beige/10 bg-navy-ink shadow-2xl transition-transform duration-500 ease-out-expo ${
          isOpen ? "translate-x-0" : isArabic ? "-translate-x-full" : "translate-x-full"
        } ${isArabic ? "right-0 border-l" : "left-0 border-r"}`}
      >
        <div className="flex items-center justify-between border-b border-beige/10 px-6 py-5">
          <h2 className="font-primary text-h3 text-beige">
            {t("title")}
            <span className="ml-2 text-small text-beige/50">
              {lines.length} {t("itemsLabel")}
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t("close") ?? "Close cart"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-beige/20 text-beige transition-[color,border-color,transform] duration-press ease-out-expo hover:border-beige active:scale-[0.94]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div
            key="empty"
            className="pop-in flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="text-body text-beige/70">{tCart("empty")}</p>
            <Link
              href="/store"
              onClick={closeCart}
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-2.5 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.97]"
            >
              {tCart("cta")}
            </Link>
          </div>
        ) : (
          <div key="lines" className="pop-in flex min-h-0 flex-1 flex-col">
            {/* Free-shipping progress */}
            <div className="border-b border-beige/10 px-6 py-4">
              <p className="text-micro text-beige/70">
                {remaining > 0
                  ? `${tStore("shippingNote", { amount: formatPrice(FREE_SHIPPING_THRESHOLD) })} — ${formatPrice(remaining)}`
                  : tStore("cart.shippingFree")}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-beige/10">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out-expo"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-beige/10 overflow-y-auto px-6">
              {lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                const name = tStore(`products.${line.slug}.name`);
                return (
                  <li key={line.slug} className="flex gap-4 py-5">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-deep">
                      <Image
                        src={product.image}
                        alt={name}
                        width={80}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-small font-medium text-beige">{name}</p>
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          aria-label={`${t("remove")} ${name}`}
                          className="text-micro text-beige/50 underline-offset-4 transition-colors duration-press hover:text-beige hover:underline"
                        >
                          {t("remove")}
                        </button>
                      </div>
                      <p className="mt-1 text-micro text-beige/50">
                        {product.sizeMl} {tStore("ml")} · {formatPrice(product.price)} {tStore("currency")}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-beige/20">
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.qty - 1)}
                            aria-label={tStore("decrease")}
                            className="flex h-8 w-8 items-center justify-center text-beige transition-transform duration-press ease-out-expo active:scale-[0.85]"
                          >
                            −
                          </button>
                          <span
                            key={line.qty}
                            className="pop-in w-8 text-center text-small tabular-nums text-beige"
                          >
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.qty + 1)}
                            aria-label={tStore("increase")}
                            className="flex h-8 w-8 items-center justify-center text-beige transition-transform duration-press ease-out-expo active:scale-[0.85]"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-small font-medium text-gold">
                          {formatPrice(product.price * line.qty)} {tStore("currency")}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-beige/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-small text-beige/70">{t("subtotal")}</span>
                <span className="text-h3 text-beige">
                  {formatPrice(subtotal)} {tStore("currency")}
                </span>
              </div>
              <Link
                href="/store/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-gold py-3.5 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.98]"
              >
                {t("checkout")}
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-micro text-beige/60 underline-offset-4 transition-colors duration-press hover:text-beige hover:underline"
              >
                {t("continueShopping")}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
