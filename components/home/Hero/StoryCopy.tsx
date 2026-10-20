"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CivilizationKey } from "./CivilizationSection";

/**
 * Chapter copy — the 3WEEQ × civilization narrative and the store CTA, layered
 * above the glass (z-50) so the words and the call to action always read over
 * the bottle.
 *
 * Desktop: the block is pushed to the leading edge of the reading direction —
 * right in Arabic, left in English — so it never crosses the centred bottle.
 * Phones: it sits in the empty band above the bottle, kept clear of the glass.
 */
export default function StoryCopy({
  slug,
  index,
}: {
  slug: CivilizationKey;
  index: number;
}) {
  const t = useTranslations(`Hero.ui.chapters.${slug}`);
  const isRtl = useLocale() === "ar";

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-50 flex items-start justify-center px-6 pt-[10svh] md:items-center md:px-16 md:pt-0 md:pb-0 ${
        isRtl ? "md:justify-end" : "md:justify-start"
      }`}
    >
      <div
        className={`max-w-md text-center md:max-w-lg ${
          isRtl ? "md:text-right" : "md:text-left"
        }`}
      >
        <p
          data-reveal
          className="font-secondary text-micro uppercase tracking-[0.35em] text-gold [text-shadow:_0px_4px_12px_rgba(0,0,0,0.9),_0px_0px_20px_rgba(0,0,0,0.6)] md:drop-shadow-[0_6px_18px_rgba(8,17,39,0.95)]"
        >
          {String(index + 1).padStart(2, "0")} — {t("kicker")}
        </p>
        <h2
          data-reveal
          className="mt-4 font-primary text-h2 leading-tight text-[#f6e6d6] [text-shadow:_0px_4px_12px_rgba(0,0,0,0.9),_0px_0px_20px_rgba(0,0,0,0.6)] md:drop-shadow-[0_10px_40px_rgba(8,17,39,0.95)]"
        >
          {t("headline")}
        </h2>
        <p
          data-reveal
          className="mx-auto mt-4 max-w-xl whitespace-pre-line text-body text-[#f6e6d6] [text-shadow:_0px_4px_12px_rgba(0,0,0,0.9),_0px_0px_20px_rgba(0,0,0,0.6)] md:mx-0 md:drop-shadow-[0_8px_30px_rgba(8,17,39,0.95)]"
        >
          {t("body")}
        </p>
        <Link
          data-reveal
          href="/store"
          className="pointer-events-auto mt-7 inline-flex items-center bg-[#cd9e61] px-8 py-3 text-sm font-medium text-[#081127] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-90 active:scale-[0.97]"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
