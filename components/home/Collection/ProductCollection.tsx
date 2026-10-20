"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PRODUCTS = [
  { id: "egypt", slug: "egypt", image: "/images/groub_section/egypt.jpg" },
  { id: "babylon", slug: "babylon", image: "/images/groub_section/babel.jpg" },
  { id: "greece", slug: "greece", image: "/images/groub_section/greece.jpg" },
  { id: "china", slug: "china", image: "/images/groub_section/china.jpg" },
] as const;

/**
 * Product Collection — luxury 4-card grid. All copy is localized via
 * the `Collection` namespace (en/ar).
 */
export default function ProductCollection() {
  const t = useTranslations("Collection");
  const scope = useRef<HTMLElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (underlineRef.current) {
          gsap.set(underlineRef.current, { strokeDashoffset: 0 });
        }
        return;
      }

      // Card stagger
      gsap.fromTo(
        "[data-card]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: scope.current, start: "top 80%" },
        },
      );

      // Underline draw
      const path = underlineRef.current;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          visibility: "visible",
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power1.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative w-full overflow-hidden bg-[#0a1128] px-4 py-10 sm:px-6 md:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh] bg-[linear-gradient(to_bottom,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)]"
      />
      {/* Wall background */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/images/new_hero/wall.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0a1128]/85" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center md:mb-16">
          <div className="flex w-full items-center justify-center gap-4 md:gap-6">
            <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-[#cd9e61]/70 sm:block md:w-28" />
            <div className="relative">
              <h2 className="font-primary text-4xl leading-none tracking-tight text-[#cd9e61] sm:text-5xl md:text-6xl lg:text-7xl">
                {t("title")}
              </h2>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 left-1/2 w-[72%] -translate-x-1/2 opacity-90 md:-bottom-2.5"
                viewBox="0 0 200 6"
                preserveAspectRatio="none"
              >
                <path
                  ref={underlineRef}
                  d="M 2 3 L 198 3"
                  fill="none"
                  stroke="#cd9e61"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-[#cd9e61]/70 sm:block md:w-28" />
          </div>
          <p className="mt-4 font-secondary text-sm text-beige/80 sm:text-base md:mt-5">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              data-card
              className="group relative flex flex-col overflow-visible border border-[#cd9e61]/30 bg-[#0A1128] transition-colors duration-300 ease-out-expo hover:border-[#cd9e61]"
            >
              {/* Card tag */}
              <div className="pointer-events-none absolute inset-x-[-1px] top-0 z-30 -translate-y-[52%]">
                <Image
                  src="/images/new_hero/card_tag.png"
                  alt=""
                  width={400}
                  height={120}
                  className="h-auto w-full"
                />
              </div>
              {/* Image area — fixed aspect, bottle centered */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A1128] pt-12">
                <Image
                  src={product.image}
                  alt={t(`products.${product.id}.name`)}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain transition-transform duration-reveal ease-out-expo group-hover:scale-[1.04]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col items-center bg-[#0A1128] px-6 pb-6 pt-5 text-center">
                <h3 className="font-primary text-lg font-semibold tracking-wide text-[#cd9e61] md:text-xl">
                  {t(`products.${product.id}.name`)}
                </h3>
                <p className="mt-2 font-secondary text-xs text-[#f6e6d6] sm:text-sm">
                  {t(`products.${product.id}.desc`)}
                </p>
                <p className="mt-5 font-secondary text-base text-[#f6e6d6] md:mt-6">
                  {t("price")}
                </p>
              </div>

              {/* CTA button — attached to the very bottom, full width, no radius */}
              <Link
                href={`/store/${product.slug}`}
                className="mt-auto inline-flex w-full items-center justify-center bg-[#cd9e61] py-3.5 text-sm font-medium text-[#081127] transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.97]"
              >
                {t("addToCart")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
