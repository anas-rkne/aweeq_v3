"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products, type CivilizationKey } from "@/config/store";
import StoryBottleCanvas from "./StoryBottleCanvas";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS: CivilizationKey[] = ["egypt", "babylon", "greece", "china"];

type ChapterText = { kicker: string; headline: string; body: string; cta: string };

const STATIC_TEXTS: Record<CivilizationKey, ChapterText> = {
  egypt: {
    kicker: "قصة عويق مع الحضارة المصرية",
    headline: "من ضفّة النيل وُلد عويق",
    body: "في مصر القديمة لم يكن العطر زينة،\nبل لغةً تكتب بها الحضارة أسرارها.\nمن طين النيل ونور المعابد تعلّمنا\nأن الرائحة ذاكرة لا تشيخ.\nومن هذا الميراث صنعنا «عويق»:\nقارورة واحدة تحمل حضارة كاملة.",
    cta: "اكتشف عطر مصر",
  },
  babylon: {
    kicker: "قصة عويق مع الحضارة البابلية",
    headline: "بين النهرين وُلد العطر فنًّا",
    body: "كتبت بابل قوانينها على الطين،\nوكتبت جمالها دخانًا وزيوتًا.\nفي حدائقها المعلّقة تفتّحت أول وردة،\nووُزِن الزعفران كالذهب.\nومن تلك الكيمياء بين الأرض والنار\nيحمل «عويق» أول عطر عرفه العالم.",
    cta: "اكتشف عطر بابل",
  },
  greece: {
    kicker: "قصة عويق مع الحضارة اليونانية",
    headline: "حيث تعلّم العطر أن يفكّر",
    body: "في اليونان خرج العطر من المعبد إلى الفكر،\nزيتون وغار وسرو تُقطَّر فكرًا.\nكان الأبطال يُدهنون قبل الألعاب،\nوكان الفلاسفة يحملون الذاكرة على بشرتهم.\nومن ذلك السعي إلى الجمال والمعنى\nيحمل «عويق» حكمة العطر.",
    cta: "اكتشف عطر اليونان",
  },
  china: {
    kicker: "قصة عويق مع الحضارة الصينية",
    headline: "على طريق الحرير يصعد الطيب",
    body: "لقّنت الصين العطر صبر الحدائق:\nشاي ينام في الجرار، وصندل يشيخ في العتمة،\nوياسمين لا يتفتّح إلا لليل.\nكان البخور يقيس ساعات الأباطرة،\nوكان العطر يُورَث كما تُورَث الأسماء.\nيحمل «عويق» ذلك النفس المتأنّي.",
    cta: "اكتشف عطر الصين",
  },
};

export default function StorySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<{ setMaterial: (key: CivilizationKey) => void } | null>(null);
  const [active, setActive] = useState<CivilizationKey>("egypt");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const tFinale = useTranslations("HandsFinale");

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const total = CHAPTERS.length;

      // Pin the viewport so the bottle stays centered while the track scrolls.
      const viewport = track.querySelector<HTMLElement>("[data-story-viewport]");
      if (viewport) {
        gsap.to(viewport, {
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // Change bottle material + active chapter as scroll reaches each chapter.
      CHAPTERS.forEach((key, i) => {
        const start = (i / total) * 100;
        const end = ((i + 1) / total) * 100;

        gsap.to({}, {
          scrollTrigger: {
            trigger: track,
            start: `top top+=${start}%`,
            end: `top top+=${end}%`,
            scrub: 1,
            onEnter: () => {
              setActive(key);
              bottleRef.current?.setMaterial(key);
            },
            onEnterBack: () => {
              setActive(key);
              bottleRef.current?.setMaterial(key);
            },
          },
        });
      });

      // Chapter rail highlights.
      const rails = gsap.utils.toArray<HTMLElement>("[data-story-rail-item]");
      rails.forEach((rail, i) => {
        gsap.fromTo(
          rail,
          { opacity: 0.3 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: track,
              start: `top top+=${(i / total) * 100}%`,
              end: `top top+=${((i + 1) / total) * 100}%`,
              scrub: true,
            },
          }
        );
      });
    },
    { scope: trackRef }
  );

  return (
    <section id="story" className="relative bg-navy-ink">
      {/* Small screens / reduced motion: static stacked list. */}
      <div className="md:hidden">
        <StaticChapters />
      </div>

      {/* Scroll spine — md and up. */}
      <div ref={trackRef} className="hidden h-[460vh] md:block relative overflow-hidden">
        {/* Pinned viewport: bottle stays centered here while track scrolls. */}
        <div data-story-viewport className="sticky top-0 left-0 w-full h-screen flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-[min(60svh,55vw)] h-[min(60svh,55vw)] md:w-[min(72svh,44vw)] md:h-[min(72svh,44vw)] pointer-events-auto">
            <StoryBottleCanvas ref={bottleRef} civilization={active} />
          </div>
        </div>

        {/* Chapter copy — each fills the track height, crossfades on scroll. */}
        {CHAPTERS.map((key, i) => (
          <div
            key={key}
            data-story-chapter
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-out ${
              active === key ? "opacity-100 z-20" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={active !== key}
          >
            <div className="mx-auto w-full max-w-2xl px-8">
              <p className="font-secondary text-small tracking-[0.35em] text-gold mb-4">
                {String(i + 1).padStart(2, "0")} — {STATIC_TEXTS[key].kicker}
              </p>
              <h2 className="font-primary text-display leading-[1.05] mb-6 text-beige">
                {STATIC_TEXTS[key].headline}
              </h2>
              <p className="mx-auto max-w-xl text-body leading-relaxed text-beige/85 mb-8">
                {STATIC_TEXTS[key].body}
              </p>
              <Link
          href={`/store/${key}`}
                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-small font-medium text-navy-ink hover:bg-beige transition-colors"
              >
                {STATIC_TEXTS[key].cta}
              </Link>
            </div>
          </div>
        ))}

        {/* Hands finale — fills the last portion of the track. */}
        <div data-story-finale className="absolute inset-0 flex flex-col items-center justify-center opacity-0 z-0 pointer-events-none">
          <Image
            src="/images/sections/hand_section_bg.jpg"
            alt={tFinale("line")}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy-ink/55" />
          <p className="relative z-10 px-8 text-center font-primary text-h2 leading-snug text-beige">
            {tFinale("line")}
          </p>
        </div>

        {/* Chapter rail on the side. */}
        <div
          className={`absolute top-1/2 z-30 flex -translate-y-1/2 flex-col gap-5 ${
            isArabic ? "right-8" : "left-8"
          }`}
        >
          {CHAPTERS.map((key, i) => (
            <div
              key={key}
              data-story-rail-item
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                active === key ? "opacity-100" : "opacity-30"
              }`}
            >
              <span className="font-secondary text-micro tabular-nums text-beige/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-gold/70" />
              <span className="text-micro text-beige/70">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticChapters() {
  return (
    <div className="flex flex-col">
      {CHAPTERS.map((key, i) => (
        <StaticChapter key={key} slug={key} index={i} />
      ))}
    </div>
  );
}

function StaticChapter({ slug, index }: { slug: CivilizationKey; index: number }) {
  const T = STATIC_TEXTS[slug] || STATIC_TEXTS.egypt;
  const product = products.find((p) => p.slug === slug) || products[0];
  return (
    <article className="relative flex min-h-[92svh] items-center overflow-hidden">
      <Image
        src={product.civilization}
        alt={T.headline}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-ink/70 via-navy-ink/35 to-navy-ink/90" />
      <div className="relative z-10 mx-auto w-full max-w-2xl px-8 py-20 text-center">
        <p className="font-secondary text-small tracking-[0.35em] text-gold">
          {String(index + 1).padStart(2, "0")} — {T.kicker}
        </p>
        <h2 className="mt-4 font-primary text-display leading-[1.05] text-beige">
          {T.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl whitespace-pre-line text-body leading-relaxed text-beige/85">
          {T.body}
        </p>
        <Link
          href={`/store/${slug}`}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-small font-medium text-navy-ink hover:bg-beige transition-colors"
        >
          {T.cta}
        </Link>
      </div>
    </article>
  );
}
