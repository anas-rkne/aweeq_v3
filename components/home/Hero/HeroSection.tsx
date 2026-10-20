"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Three.js stays out of the initial hero bundle (nextjs-creative-perf). */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

type HeroPhase = "loading" | "reveal" | "still";

/**
 * The medium question ("may this device run the 3D scene?") is read through
 * `useSyncExternalStore`, not setState-in-effect: the server snapshot assumes
 * the capable path (hydration-safe), and the real client values arrive right
 * after hydration — the pattern v2's HeroLoader proved.
 */
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServer = () => false;

const subscribeNever = () => () => {};
let webglSupport: boolean | null = null;
const getWebglSupport = () => {
  if (webglSupport === null) {
    try {
      const probe = document.createElement("canvas");
      webglSupport = Boolean(
        probe.getContext("webgl2") || probe.getContext("webgl")
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
};
const getWebglSupportServer = () => true;

/**
 * Hero — one calm screen: the bottle, one great line, two doors.
 *
 * Entrance (MASTER-PLAN 8.3): logo pulse → the glass fades in over its own
 * poster → the copy rises 20px in three staggered steps (~800ms total). The
 * poster IS the first paint (LCP) — a real bottle image, never an empty navy
 * box, so the screen is complete before WebGL even wakes up.
 *
 * Fallbacks are contracts, not niceties:
 *   - `prefers-reduced-motion` → no WebGL at all: poster + copy, static.
 *   - no WebGL context → the same.
 *   - the scene has not presented within 3s → the SCREEN SETTLES immediately
 *     (loader gone, copy up, poster standing); the glass is not cancelled —
 *     if it arrives later it silently upgrades the poster.
 *   - GLB load failure → settle, dispose, done.
 *
 * The poster stands in for asset B1 (2400×1600) from MASTER-PLAN 9.B until
 * the client delivers it. The backdrop carries a marked slot for the A1
 * cuneiform frieze — until then a quiet navy glow holds the stage.
 */
export default function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  );
  const webglOk = useSyncExternalStore(
    subscribeNever,
    getWebglSupport,
    getWebglSupportServer
  );

  const [phase, setPhase] = useState<HeroPhase>("loading");
  const [settled, setSettled] = useState(false);
  const [failed, setFailed] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);

  /** Reduced motion or a missing WebGL context = the static poster, full stop. */
  const mediumStatic = reducedMotion || !webglOk;
  const effectivePhase: HeroPhase =
    mediumStatic || failed
      ? "still"
      : phase === "reveal"
        ? "reveal"
        : settled
          ? "still"
          : "loading";

  // The 3s ceiling ends the WAITING state, never the scene itself: the loader
  // goes, the copy rises, the poster stands — and a late glass still lands.
  useEffect(() => {
    if (mediumStatic || settled || phase !== "loading") return;
    const id = window.setTimeout(() => setSettled(true), 3000);
    return () => window.clearTimeout(id);
  }, [mediumStatic, settled, phase]);

  // A whisper of scroll drift on the bottle layer — transform only, capped.
  useEffect(() => {
    if (mediumStatic || failed) return;
    const slot = slotRef.current;
    if (!slot) return;
    let raf = 0;
    let applied = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const target = Math.min(window.scrollY * 0.06, 28);
        if (Math.abs(target - applied) < 0.05) return;
        applied = target;
        slot.style.transform = `translateY(${applied}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [mediumStatic, failed]);

  const copyVisible = effectivePhase !== "loading";
  const revealCell = (delay: number, extra = "") => ({
    className: `${extra} hero-reveal transition-[opacity,transform] duration-[600ms] ease-out-expo motion-reduce:transition-none ${
      copyVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    } motion-reduce:translate-y-0 motion-reduce:opacity-100`,
    style: {
      transitionDelay: copyVisible ? `${delay}ms` : "0ms",
    } as CSSProperties,
  });

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-navy-ink"
    >
      {/* Backdrop — z-0. A quiet navy glow holds the stage; the A1 cuneiform
          frieze (MASTER-PLAN 9.A) lands on this layer when delivered. Until
          then a subtle wedge motif marks the slot so the civilizations are
          present from the first frame. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(58%_50%_at_63%_40%,rgba(47,78,120,0.5),transparent_100%)]" />
        {/* Cuneiform wedge frieze — a marked, low-opacity placeholder for A1. */}
        <svg
          className="absolute inset-x-0 top-0 h-24 w-full text-gold/[0.06] md:h-32"
          preserveAspectRatio="none"
          viewBox="0 0 1200 100"
          fill="currentColor"
        >
          <defs>
            <pattern id="cuneiform" width="60" height="50" patternUnits="userSpaceOnUse">
              <path d="M10 40 L20 10 L30 40 Z" />
              <path d="M32 30 L42 8 L52 30 Z" opacity="0.7" />
            </pattern>
          </defs>
          <rect width="1200" height="100" fill="url(#cuneiform)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-6 pb-10 pt-[calc(env(safe-area-inset-top)+5.25rem)] md:grid md:grid-cols-[minmax(19rem,42%)_1fr] md:items-center md:gap-6 md:px-10 md:pb-0 md:pt-[calc(env(safe-area-inset-top)+4.5rem)]">
        {/* The copy: headline, one supporting line, two doors — nothing else. */}
        <div dir={isArabic ? "rtl" : "ltr"} className="shrink-0">
          <h1
            id="home-hero-title"
            {...revealCell(320, "font-primary text-display text-beige")}
          >
            {t("headline")}
          </h1>
          <p {...revealCell(430, "mt-5 max-w-md text-body text-beige/70")}>
            {t("support")}
          </p>
          <div
            {...revealCell(
              540,
              "mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
            )}
          >
            <Link
              href="#collection"
              className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-small font-medium text-navy-ink transition-colors duration-300 ease-out-expo hover:bg-beige"
            >
              {t("cta")}
            </Link>
            <a
              href="#story"
              className="text-small text-beige/80 underline-offset-8 transition-colors duration-300 ease-out-expo hover:text-beige hover:underline hover:decoration-gold"
            >
              {t("storyCta")}
            </a>
          </div>
        </div>

        {/* The bottle stage — the poster paints first (LCP), the glass fades
            in over it, and both ride a capped scroll drift in one layer. */}
        <div className="relative mt-6 flex min-h-0 flex-1 items-center justify-center md:mt-0 md:h-full">
          <div className="relative h-[min(52svh,84vw)] w-[min(52svh,84vw)] md:h-[min(80svh,42vw)] md:w-[min(80svh,42vw)]">
            <Image
              src="/art/hero/pixlr-bottle.webp"
              alt=""
              fill
              preload
              sizes="(min-width: 64rem) 42vw, 84vw"
              className={`object-contain transition-opacity duration-500 ease-out-expo ${
                effectivePhase === "reveal" ? "opacity-0" : "opacity-100"
              }`}
            />

            <div
              ref={slotRef}
              className="absolute inset-0 will-change-transform"
            >
              {!mediumStatic && !failed && (
                <div
                  className={`absolute inset-0 transition-opacity duration-[600ms] ease-out-expo ${
                    effectivePhase === "reveal" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <HeroCanvas
                    onReady={() => setPhase("reveal")}
                    onFail={() => setFailed(true)}
                  />
                </div>
              )}

              {/* Loader — the wordmark breathes only while the glass loads. */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out-expo motion-reduce:hidden ${
                  effectivePhase === "loading"
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <div className="flex flex-col items-center gap-5">
                  <Image
                    src="/art/hero/logo-11.png"
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 animate-[hero-logo-pulse_1.6s_ease-in-out_infinite] object-contain"
                  />
                  <span className="h-px w-14 animate-[hero-rule-pulse_1.6s_ease-in-out_infinite] bg-gold/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No-JS: the copy must never stay hidden behind an entrance that
          will not run. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.hero-reveal{opacity:1!important;transform:none!important}</style>",
        }}
      />
    </section>
  );
}
