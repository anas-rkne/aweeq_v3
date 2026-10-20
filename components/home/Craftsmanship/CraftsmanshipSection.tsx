"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import BottleCanvas from "../Hero/NewHeroBottleCanvas";

export default function CraftsmanshipSection() {
  const t = useTranslations("Collection");

  return (
    <section className="relative w-full overflow-hidden bg-[#081127] md:bg-transparent">
      {/* Top Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh] bg-[linear-gradient(to_bottom,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)]"
      />
      
      {/* Full background (Desktop) / Mobile Background (Top Half) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 h-[45vh] md:h-full">
        {/* الجدار تحت طبقة الغيوم — موبايل فقط */}
        <Image
          src="/images/new_hero/wall.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/images/new_hero/cheetah_clouds_clean_background.png"
          alt="Cheetah Background"
          fill
          sizes="100vw"
          // object-contain للموبايل لعدم القص، و object-cover للديسكتوب
          className="object-contain object-top md:object-cover md:object-center"
          priority
        />
        {/* تدرج لدمج الصورة مع النص في الموبايل */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#081127] to-transparent md:hidden" />
        <div className="absolute inset-0 bg-[#0a1128]/35 hidden md:block" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col px-6 py-6 md:min-h-[80vh] md:flex-row md:items-center md:justify-between md:px-10 md:py-16 lg:px-14 xl:px-20">
        
        {/* Left spacer (Desktop only) */}
        <div className="hidden flex-1 md:block" />

        {/* Mobile: Bottle (Centered below image) */}
        {/* Desktop: Absolute Center Bottle */}
        <div className="relative mt-[35vh] flex w-full justify-center md:absolute md:left-[48%] md:top-1/2 md:mt-0 md:w-auto md:-translate-x-1/2 md:-translate-y-1/2 md:left-[46%] lg:left-[44%]">
          
          {/* حاوية الزجاجة (تصغير للموبايل، حجم كامل للديسكتوب) */}
          <div className="relative flex h-[30svh] w-[16svh] items-center justify-center md:h-[60svh] md:w-[26svh] lg:h-[68svh] lg:w-[30svh] xl:h-[74svh] xl:w-[32svh]">
            
            {/* الظل أسفل الزجاجة */}
            <div
              aria-hidden="true"
              className="absolute -bottom-6 left-1/2 h-6 w-[150%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl md:-bottom-8 md:h-10 md:w-[190%] md:blur-2xl"
            />
            
            <div className="relative z-10 h-full w-full">
              <BottleCanvas />
            </div>
          </div>
        </div>

        {/* Text & Button Section — على الموبايل المحتوى كله بالنص والزر تحته،
            وعلى الديسكتوب يرجع للحافة اليمنى كالسابق. */}
        <div className="relative z-20 mt-8 flex w-full flex-col items-center text-center md:mt-0 md:ml-auto md:max-w-xl md:items-end md:text-right">
          <p className="font-primary text-lg leading-relaxed text-beige/95 sm:text-xl md:text-2xl">
            في قلب الطبيعة، نختار أندر المكونات من أجود أرض في العالم، نستخلص الزهور والعود ببطء وبعناية، في عملية تقليدية تتطلب الصبر والخبرة لتحويلها إلى عطر
          </p>
          <p className="mt-6 font-primary text-base leading-relaxed text-beige/90 sm:text-lg md:mt-8">
            عويق، يجمع بين عراقة الحضارات في زجاجة واحدة، ليحمل لك التاريخ بين يديك بأجود الطرق وأرقى التفاصيل.
          </p>
          <Link
            href="/store"
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center bg-[#cd9e61] px-8 py-3 text-sm font-medium text-[#081127] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-90 active:scale-[0.97] sm:mt-10 md:w-auto md:max-w-none"
          >
            اكتشف المجموعة
          </Link>
        </div>
      </div>

      {/* Bottom Gradient — مخفي على الموبايل لأنه كان مغطي الزرار */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-[18svh] bg-[linear-gradient(to_top,#050a14_0%,rgba(5,10,20,0.9)_20%,rgba(5,10,20,0.6)_60%,transparent_100%)] md:block"
      />
    </section>
  );
}