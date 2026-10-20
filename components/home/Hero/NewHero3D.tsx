"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroOverlay from "./HeroOverlay";
import CivilizationSection, { type CivilizationKey } from "./CivilizationSection";
import BottleCanvas from "./NewHeroBottleCanvas";
import type { NewHeroBottleHandle } from "./newHeroBottleScene";

const CIVILIZATIONS: CivilizationKey[] = ["egypt", "babylon", "greece", "china"];

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function NewHero3D() {
  const tHero = useTranslations("Hero.ui");
  const heroBgRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const cercileRef = useRef<HTMLDivElement>(null);
  const bottleHandleRef = useRef<NewHeroBottleHandle | null>(null);

  let spinTarget = 0;
  let spinCurrent = 0;

  useGSAP(
    () => {
      const root = document.querySelector("[data-hero-root]");
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        spinTarget = 0;
        spinCurrent = 0;
        if (cercileRef.current) gsap.set(cercileRef.current, { rotation: 0 });
      });

      mm.add("(min-width: 1px)", () => {
        const heroBg = heroBgRef.current;
        const bottle = bottleRef.current;
        const cercile = cercileRef.current;

        if (heroBg) gsap.set([heroBg], { willChange: "transform" });
        if (bottle) gsap.set(bottle, { transformOrigin: "50% 80%" });
        if (cercile) gsap.set(cercile, { transformOrigin: "50% 50%" });

        if (heroBg) {
          gsap.to(heroBg, {
            yPercent: 8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero-root]",
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity()) / 900;
            spinTarget = gsap.utils.clamp(0, 3.2, v);
          },
        });

        gsap.ticker.add((time, deltaTime) => {
          spinTarget *= 0.94;
          spinCurrent += (spinTarget - spinCurrent) * 0.12;
          if (cercileRef.current) gsap.set(cercileRef.current, { rotation: spinCurrent * 60 });
          bottleHandleRef.current?.setScrollSpin(spinCurrent);
        });

        ScrollTrigger.refresh();

        window.addEventListener("load", () => ScrollTrigger.refresh());
        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
      });
    },
    { scope: "[data-hero-root]" },
  );

  return (
    <div data-hero-root className="relative">
      {/* HERO SECTION */}
      <section className="relative h-[100svh] overflow-hidden bg-[#050a14]">
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <Image
            src="/images/new_hero/wall.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "contrast(1.15) saturate(1.25) brightness(0.95)" }}
          />
        </div>

        <div
          ref={heroBgRef}
          className="absolute inset-0 z-[1] will-change-transform"
        >
          <Image
            src="/images/new_hero/civilizations_five_mobile_hero.png"
            alt=""
            fill
            sizes="100vw"
            preload
            className="object-cover object-[50%_100%] md:hidden"
            style={{ filter: "contrast(1.15) saturate(1.25) brightness(0.95)" }}
          />
          <Image
            src="/images/new_hero/civilizations_five_desktop_hero.png"
            alt=""
            fill
            sizes="100vw"
            preload
            className="hidden object-cover object-[50%_100%] md:block"
            style={{ filter: "contrast(1.15) saturate(1.25) brightness(0.95)" }}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,17,39,0.7)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] mix-blend-color bg-[#2f4e78]/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(80%_70%_at_50%_42%,transparent_38%,rgba(8,15,27,0.62)_100%)]"
        />

        {/* Mobile layout — taglines sit in the top band; the shared glass below
            holds the stage, exactly like the desktop composition. */}
        <div className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-start px-6 pt-[12svh] md:hidden">
          <div className="w-full text-center">
            <div className="font-primary text-[14vw] leading-none tracking-tight text-beige [text-shadow:_0px_6px_18px_rgba(0,0,0,0.95),_0px_0px_30px_rgba(0,0,0,0.8)]">
              {tHero("hero.tagline1")}
            </div>
            <div className="mt-4 font-primary text-[5vw] leading-none tracking-[0.28em] text-beige/95 [text-shadow:_0px_6px_18px_rgba(0,0,0,0.95),_0px_0px_30px_rgba(0,0,0,0.8)]">
              {tHero("hero.tagline2")}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] hidden items-end justify-end md:flex">
          <div className="mx-auto flex w-full max-w-[90rem] items-end justify-between px-10 pb-12 lg:px-14 xl:px-20">
            <div className="flex-1" />
            <div className="flex flex-col items-end gap-6 text-right lg:gap-8 xl:gap-10">
              <div className="font-primary text-[9vw] leading-none tracking-tight text-beige/95 drop-shadow-[0_40px_120px_rgba(8,17,40,0.9)] lg:text-[8vw] xl:text-[7vw]">
                {tHero("hero.tagline1")}
              </div>
              <div className="font-primary text-[3.6vw] leading-none tracking-[0.22em] text-beige/90 drop-shadow-[0_30px_80px_rgba(8,17,40,0.9)] lg:text-[3vw] xl:text-[2.6vw]">
                {tHero("hero.tagline2")}
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[35] h-[18svh] bg-[linear-gradient(to_top,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)]"
        />

        <div className="hidden md:block">
          <HeroOverlay />
        </div>
      </section>

      {CIVILIZATIONS.map((slug: CivilizationKey, index: number) => (
        <CivilizationSection key={slug} slug={slug} index={index} />
      ))}

      {/* One shared glass for every breakpoint — sticky across the hero and all
          four chapters. On phones it rides in the lower band so the chapter copy
          keeps the empty space above it. */}
      <div className="pointer-events-none absolute inset-0 z-40">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center">
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ transformOrigin: "50% 50%" }}
          >
            <div
              ref={cercileRef}
              className="absolute flex items-center justify-center"
              style={{ transformOrigin: "50% 50%", willChange: "transform", opacity: 0.05 }}
            >
              <Image
                src="/images/new_hero/cercile.png"
                alt=""
                width={900}
                height={900}
                className="h-[min(78vw,52svh)] w-[min(78vw,52svh)] object-contain md:h-[min(90vw,90vh)] md:w-[min(90vw,90vh)]"
              />
            </div>
            <div
              ref={bottleRef}
              className="relative h-[32svh] w-[14svh] will-change-transform md:h-[46svh] md:w-[20svh]"
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-5 left-1/2 h-6 w-[180%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
              />
              <div className="relative z-10 h-full w-full">
                <BottleCanvas
                  onReady={(handle) => {
                    bottleHandleRef.current = handle;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
