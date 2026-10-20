"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import BottleCanvas from "../Hero/NewHeroBottleCanvas";

export default function CraftsmanshipSection() {
  const t = useTranslations("Collection");

  return (
    <section className="relative w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh] bg-[linear-gradient(to_bottom,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)]"
      />
      {/* Full background */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/images/new_hero/cheetah_clouds_clean_background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0a1128]/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-[90rem] items-center justify-between px-6 py-16 md:min-h-[80vh] md:px-10 lg:px-14 xl:px-20">
        {/* Left spacer */}
        <div className="hidden flex-1 md:block" />

        {/* Center bottle */}
        <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[46%] lg:left-[44%]">
          <div className="relative flex h-[48svh] w-[21svh] items-center justify-center md:h-[60svh] md:w-[26svh] lg:h-[68svh] lg:w-[30svh] xl:h-[74svh] xl:w-[32svh]">
            <div
              aria-hidden="true"
              className="absolute -bottom-8 left-1/2 h-10 w-[190%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-2xl"
            />
            <div className="relative z-10 h-full w-full">
              <BottleCanvas />
            </div>
          </div>
        </div>

        {/* Right text */}
        <div className="relative z-20 ml-auto flex max-w-xl flex-col items-end text-right">
          <p className="font-primary text-lg leading-relaxed text-beige/95 sm:text-xl md:text-2xl">
            في قلب الطبيعة، نختار أندر المكونات من أجود أرض في العالم، نستخلص الزهور والعود ببطء وبعناية، في عملية تقليدية تتطلب الصبر والخبرة لتحويلها إلى عطر
          </p>
          <p className="mt-6 font-primary text-base leading-relaxed text-beige/90 sm:text-lg md:mt-8">
            عويق، يجمع بين عراقة الحضارات في زجاجة واحدة، ليحمل لك التاريخ بين يديك بأجود الطرق وأرقى التفاصيل.
          </p>
          <Link
            href="/store"
            className="mt-8 inline-flex items-center bg-[#cd9e61] px-8 py-3 text-sm font-medium text-[#081127] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-90 active:scale-[0.97] sm:mt-10"
          >
            اكتشف المجموعة
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18svh] bg-[linear-gradient(to_top,#050a14_0%,rgba(5,10,20,0.9)_20%,rgba(5,10,20,0.6)_60%,transparent_100%)]"
      />
    </section>
  );
}
