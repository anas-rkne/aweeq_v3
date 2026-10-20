"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import StoryCopy from "./StoryCopy";

gsap.registerPlugin(ScrollTrigger);

export type CivilizationKey = "egypt" | "babylon" | "greece" | "china";

const PLATES: Record<
  CivilizationKey,
  { desktop: string; mobile: string }
> = {
  egypt: {
    desktop: "/images/new_hero/heros/egypt_desktop_hero.webp",
    mobile: "/images/new_hero/heros/heros_mobile/egypt_mobile_hero.webp",
  },
  babylon: {
    desktop: "/images/new_hero/heros/babylon_desktop_hero.webp",
    mobile: "/images/new_hero/heros/heros_mobile/babylon_mobile_hero.webp",
  },
  greece: {
    desktop: "/images/new_hero/heros/greece_desktop_hero.webp",
    mobile: "/images/new_hero/heros/heros_mobile/greece_mobile_hero.webp",
  },
  china: {
    desktop: "/images/new_hero/heros/china_desktop_hero.webp",
    mobile: "/images/new_hero/heros/heros_mobile/china_mobile_hero.webp",
  },
};

/**
 * One civilization chapter — a full-height scene sharing the site's bottle.
 *
 * The plate (a desktop and a mobile cut) fills the section and drifts on its
 * own parallax track, so the art separates from the glass as the chapter enters
 * and leaves. The chapter copy sits above the glass and keeps to the empty side
 * of the frame (right in Arabic, left in English; a band above the bottle on
 * phones) so it never covers it.
 */
export default function CivilizationSection({
  slug,
  index,
}: {
  slug: CivilizationKey;
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const plate = plateRef.current;
      const copy = copyRef.current;
      if (!section || !plate || !copy) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Plate parallax across the whole pass.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          plate,
          { yPercent: -7, scale: 1.08 },
          { yPercent: 7, scale: 1.03, ease: "none" },
          0
        );

      // Copy reveal — the words rise and fade in, line by line, as the chapter
      // takes the frame. Stretched across the full entry so the motion is read,
      // not skipped: it starts the moment the section enters and settles as the
      // section centres, then reverses on the way back up.
      const words = copy.querySelectorAll("[data-reveal]");
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 35%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          words,
          { autoAlpha: 0, y: 48, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            stagger: 0.4,
            duration: 1.4,
          },
          0
        );
    },
    { scope: sectionRef }
  );

  const plate = PLATES[slug];

  return (
    <section
      ref={sectionRef}
      id={slug}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#050a14]"
    >
      {/* Wall background */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/images/new_hero/wall.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(1.1) contrast(1.05) brightness(0.95)" }}
        />
      </div>
      {/* Scene plate — full-bleed, standard layer above the wall */}
      <div
        ref={plateRef}
        aria-hidden="true"
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <Image
          src={plate.mobile}
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
          style={{ filter: "saturate(1.1) contrast(1.05) brightness(0.95)" }}
        />
        <Image
          src={plate.desktop}
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover md:block"
          style={{ filter: "saturate(1.1) contrast(1.05) brightness(0.95)" }}
        />
      </div>

      {/* Cinematic vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,17,39,0.7)_100%)]"
      />

      {/* Legibility grade — minimal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] hidden bg-[radial-gradient(70%_70%_at_50%_45%,rgba(8,15,27,0)_40%,rgba(8,15,27,0.5)_100%)] md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-[#081127]/20 via-[#081127]/90 to-[#081127]/20 md:hidden"
      />

      {/* Seam veils */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh] bg-[linear-gradient(to_bottom,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18svh] bg-[linear-gradient(to_top,#050a14_0%,rgba(5,10,20,0.9)_20%,rgba(5,10,20,0.6)_60%,transparent_100%)]"
      />

      {/* Chapter copy + store CTA, above the glass. */}
      <div ref={copyRef} className="absolute inset-0 z-50">
        <StoryCopy index={index} slug={slug} />
      </div>
    </section>
  );
}
