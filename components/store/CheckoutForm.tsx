"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  getProduct,
} from "@/config/store";
import { useCart } from "@/components/cart/CartContext";
import Brandify from "@/components/ui/Brandify";

/**
 * Checkout — a short, honest order form (MASTER-PLAN §5.1: order → copy /
 * WhatsApp, no payment). On submit it builds a plain-text order, shows a
 * success panel with a reference, a copy button and a WhatsApp deep link.
 * Validation is inline (required fields + a basic phone shape).
 */
export default function CheckoutForm() {
  const t = useTranslations("Store.checkout");
  const tStore = useTranslations("Store");
  const tCart = useTranslations("Store.cart");
  const { lines, subtotal, clear } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30;
  const total = subtotal + shipping;

  const update = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const buildOrderText = () => {
    const items = lines
      .map((l) => {
        const p = getProduct(l.slug);
        return `- ${tStore(`products.${l.slug}.name`)} × ${l.qty} — ${formatPrice((p?.price ?? 0) * l.qty)} ${tStore("currency")}`;
      })
      .join("\n");
    return `${t("orderRef")}: ${orderRef}\n\n${items}\n\n${t("summary")}:\n${t("name")}: ${form.name}\n${t("phone")}: ${form.phone}\n${t("city")}: ${form.city}\n${t("address")}: ${form.address}\n${t("notes")}: ${form.notes || "—"}\n\n${tStore("cart.subtotal")}: ${formatPrice(subtotal)}\n${tStore("cart.total")}: ${formatPrice(total)} ${tStore("currency")}`;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t("required");
    if (!form.phone.trim()) next.phone = t("required");
    else if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) next.phone = t("invalidPhone");
    if (!form.city.trim()) next.city = t("required");
    if (!form.address.trim()) next.address = t("required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const ref = `3W-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrderRef(ref);
    clear();
  };

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(buildOrderText())}`;

  /* ---- Success state ---- */
  if (orderRef) {
    return (
      <div className="panel-in mx-auto max-w-xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              className="check-draw"
              d="M5 13l4 4L19 7"
              stroke="#cd9e61"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 font-primary text-h2 text-beige">{t("successTitle")}</h1>
        <p className="mt-3 text-body text-beige/75">{t("successBody")}</p>
        <p className="mt-5 inline-block rounded-full border border-gold/40 bg-navy-deep px-5 py-2 text-small tabular-nums text-gold">
          {t("orderRef")}: {orderRef}
        </p>
        <p className="mt-6 text-micro text-beige/60">{t("note")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={copyOrder}
            className="rounded-full border border-beige/30 px-6 py-2.5 text-small text-beige transition-[color,border-color,transform] duration-press ease-out-expo hover:border-gold active:scale-[0.97]"
          >
            {copied ? t("copied") : t("copyOrder")}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold px-6 py-2.5 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.97]"
          >
            {t("whatsapp")}
          </a>
          <Link href="/store" className="rounded-full px-3 py-2.5 text-small text-beige/70 underline-offset-4 transition-colors duration-press hover:text-beige hover:underline">
            {t("placeAnother")}
          </Link>
        </div>
      </div>
    );
  }

  /* ---- Empty cart ---- */
  if (lines.length === 0) {
    return (
      <div className="panel-in mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-primary text-h2 text-beige">{t("emptyTitle")}</h1>
        <p className="mt-3 text-body text-beige/70"><Brandify text={t("emptyDesc")} /></p>
        <Link
          href="/store"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.97]"
        >
          {tCart("continueShopping")}
        </Link>
      </div>
    );
  }

  /* ---- Form ---- */
  return (
    <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <h1 className="font-primary text-display text-beige">{t("title")}</h1>

        <Field label={t("name")} error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name")(e.target.value)}
            className={inputCls(Boolean(errors.name))}
            autoComplete="name"
          />
        </Field>

        <Field label={t("phone")} error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone")(e.target.value)}
            className={inputCls(Boolean(errors.phone))}
            autoComplete="tel"
            dir="ltr"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("city")} error={errors.city}>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city")(e.target.value)}
              className={inputCls(Boolean(errors.city))}
              autoComplete="address-level2"
            />
          </Field>
          <Field label={t("address")} error={errors.address}>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address")(e.target.value)}
              className={inputCls(Boolean(errors.address))}
              autoComplete="street-address"
            />
          </Field>
        </div>

        <Field label={t("notes")}>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes")(e.target.value)}
            className={`${inputCls(false)} resize-none`}
          />
        </Field>

        <p className="text-micro text-beige/60">{t("note")}</p>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gold py-4 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.99] sm:w-auto sm:px-12"
        >
          {t("submit")}
        </button>
      </form>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-beige/10 bg-navy-deep p-6">
        <h2 className="font-primary text-h3 text-beige">{t("summary")}</h2>
        <ul className="mt-5 flex flex-col gap-4">
          {lines.map((line) => {
            const p = getProduct(line.slug);
            if (!p) return null;
            return (
              <li key={line.slug} className="flex items-center gap-4">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-navy">
                  <Image src={p.image} alt="" width={56} height={64} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-small font-medium text-beige">
                    {tStore(`products.${line.slug}.name`)} <span className="text-beige/50">× {line.qty}</span>
                  </p>
                  <p className="mt-0.5 text-micro text-beige/60">
                    {p.sizeMl} {tStore("ml")}
                  </p>
                </div>
                <p className="text-small tabular-nums text-gold">
                  {formatPrice(p.price * line.qty)} {tStore("currency")}
                </p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 flex flex-col gap-2 border-t border-beige/10 pt-5 text-small">
          <div className="flex justify-between">
            <dt className="text-beige/70">{tStore("cart.subtotal")}</dt>
            <dd className="tabular-nums text-beige">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-beige/70">{tStore("cart.shipping")}</dt>
            <dd className="tabular-nums text-beige">
              {shipping === 0 ? tStore("cart.shippingFree") : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-beige/10 pt-3 text-base">
            <dt className="font-medium text-beige">{tStore("cart.total")}</dt>
            <dd className="tabular-nums font-medium text-gold">{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-small text-beige/80">{label}</span>
      {children}
      {error && <span className="text-micro text-red-300">{error}</span>}
    </label>
  );
}

const inputCls = (hasError: boolean) =>
  `h-12 w-full rounded-xl border bg-navy-ink/60 px-4 text-small text-beige placeholder:text-beige/35 focus:outline-none transition-colors ${
    hasError ? "border-red-300/70" : "border-beige/20 focus:border-gold"
  }`;
