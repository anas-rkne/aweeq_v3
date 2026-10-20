"use client";

import { useTranslations } from "next-intl";

/**
 * Hero UI overlay — sits above every parallax layer (z-50).
 *
 * Bottom-left : three stat columns over a "Book Now" CTA + descriptive blurb.
 * Bottom-right: a glassmorphism feature card with a gradient plate and
 *               pagination (01/10 + slider track).
 *
 * The top navigation lives in the global Navbar; this overlay intentionally
 * starts below the header line. On phones the card and the stats stack into a
 * single column so nothing overlaps.
 */
export default function HeroOverlay() {
  const t = useTranslations("Hero.ui");

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-end">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-6 pb-8 md:flex-row md:items-end md:justify-between md:gap-12 md:px-10 md:pb-12">
        {/* Left column — CTA + blurb */}
        <div className="max-w-xl">
          <div className="mt-2 flex items-center gap-5">
            <button
              type="button"
              className="pointer-events-auto inline-flex shrink-0 items-center bg-[#cd9e61] px-8 py-3 text-sm font-medium text-[#081127] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-90 active:scale-[0.97]"
            >
              {t("book")}
            </button>
            <p className="hidden max-w-sm text-sm leading-relaxed text-beige/90 sm:block">
              {t("blurb")}
            </p>
          </div>
        </div>

        {/* Right column — removed as requested */}
        <div />
      </div>
    </div>
  );
}


