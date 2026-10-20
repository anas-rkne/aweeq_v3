"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * The Closing — one calm call to action plus a newsletter capture and a trust
 * bar (MASTER-PLAN §6.6). The newsletter is client-side only: there is no
 * backend yet, so a submit confirms locally and never pretends to send.
 */
export default function ClosingSection() {
  const t = useTranslations("Closing");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section className="relative overflow-hidden bg-navy-ink py-24 md:py-32">
      {/* Quiet radial glow — the A4 tile would sit here when delivered. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(47,78,120,0.45),transparent_100%)]"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-secondary text-small tracking-[0.35em] text-gold">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 font-primary text-display leading-[1.08] text-beige">
          {t("title")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-body text-beige/75">{t("body")}</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/store"
            className="inline-flex items-center justify-center rounded-full bg-gold px-9 py-3.5 text-small font-medium text-navy-ink transition-colors duration-300 ease-out-expo hover:bg-beige"
          >
            {t("cta")}
          </Link>
        </div>

        {/* Newsletter */}
        <div className="mx-auto mt-14 max-w-md">
          {done ? (
            <p className="rounded-full border border-gold/40 bg-navy-deep/60 px-6 py-4 text-small text-beige">
              {t("thanks")}
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                {t("newsletterLabel")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletterPlaceholder")}
                className="h-12 flex-1 rounded-full border border-beige/20 bg-navy-deep/70 px-5 text-small text-beige placeholder:text-beige/40 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full border border-beige/30 px-7 text-small font-medium text-beige transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                {t("newsletterCta")}
              </button>
            </form>
          )}
        </div>

        {/* Trust bar — real facts only (MASTER-PLAN §11: no invented claims). */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-micro text-beige/60">
          <span>{t("trust.shipping")}</span>
          <span className="hidden h-3 w-px bg-beige/20 sm:block" />
          <span>{t("trust.authentic")}</span>
          <span className="hidden h-3 w-px bg-beige/20 sm:block" />
          <span>{t("trust.secure")}</span>
        </div>
      </div>
    </section>
  );
}
