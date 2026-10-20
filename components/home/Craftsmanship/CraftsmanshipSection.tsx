"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
// import BottleCanvas from "../Hero/NewHeroBottleCanvas"; // تم تعطيله مؤقتاً لحل مشكلة الـ 500 Error

export default function CraftsmanshipSection() {
  const t = useTranslations("Collection");

  return (
    <section className="relative w-full overflow-hidden bg-[#081127]">
      {/* Top Gradient (Desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh] bg-[linear-gradient(to_bottom,#050a14_0%,rgba(5,10,20,0.8)_40%,transparent_100%)] hidden md:block"
      />

      {/* 
        Main Container: 
        - On Mobile: flex-col (Vertical Stack)
        - On Desktop: md:flex-row (Side by Side)
      */}
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col md:flex-row md:items-center md:justify-between">
        
        {/* 1. Image Section (Top on Mobile, Full Background on Desktop) */}
           {/* 1. Image Section (Top on Mobile, Full Background on Desktop) */}
            {/* 1. Image Section (Top on Mobile, Full Background on Desktop) */}
        <div className="relative w-full h-[45vh] bg-[#081127] md:absolute md:inset-0 md:h-full md:z-0">
          <Image
            src="/images/new_hero/cheetah_clouds_clean_background.png"
            alt="Cheetah and Bottle"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            // التعديل هنا: استخدمنا object-cover للموبايل أيضاً، مع ضبط الاتجاه للأعلى
            className="object-cover object-top md:object-cover md:object-center" 
            priority
          />
          {/* تدرج سفلي لدمج الصورة مع النص وإخفاء خط القطع */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#081127] to-transparent md:hidden" />
        </div>

        {/* 2. Text & Button Section (Bottom on Mobile, Right Side on Desktop) */}
        <div className="relative z-20 flex w-full flex-col items-end bg-[#081127] p-6 md:ml-auto md:w-1/2 md:bg-transparent md:p-10 md:pr-20 lg:pr-32">
          
          {/* Text */}
          <div className="text-right">
            <p className="font-primary text-lg leading-relaxed text-[#f6e6d6] sm:text-xl md:text-2xl">
              في قلب الطبيعة، نختار أندر المكونات من أجود أرض في العالم، نستخلص الزهور والعود ببطء وبعناية، في عملية تقليدية تتطلب الصبر والخبرة لتحويلها إلى عطر
            </p>
            <p className="mt-6 font-primary text-base leading-relaxed text-[#f6e6d6]/90 sm:text-lg md:mt-8">
              عويق، يجمع بين عراقة الحضارات في زجاجة واحدة، ليحمل لك التاريخ بين يديك بأجود الطرق وأرقى التفاصيل.
            </p>
          </div>

          {/* Button */}
          <Link
            href="/store"
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center bg-[#cd9e61] px-8 py-3 text-sm font-medium text-[#081127] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-90 active:scale-[0.97] sm:mt-10 md:w-auto md:max-w-none"
          >
            اكتشف المجموعة
          </Link>
        </div>
      </div>

      {/* Bottom Gradient (Desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18svh] bg-[linear-gradient(to_top,#050a14_0%,rgba(5,10,20,0.9)_20%,rgba(5,10,20,0.6)_60%,transparent_100%)] hidden md:block"
      />
    </section>
  );
}