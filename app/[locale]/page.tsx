import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic"; // 1. استيراد دالة dynamic من Next.js
import ProductCollection from "@/components/home/Collection/ProductCollection";
import CraftsmanshipSection from "@/components/home/Craftsmanship/CraftsmanshipSection";

// 2. تحويل الهيرو لمكون ديناميكي (يعمل فقط في المتصفح)
const NewHero3D = dynamic(() => import("@/components/home/Hero/NewHero3D"), {
  ssr: false, // تعطيل الـ Server-Side Rendering لهذا المكون فقط لحل مشكلة GSAP
});

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col">
      <NewHero3D />
      <ProductCollection />
      <CraftsmanshipSection />
    </main>
  );
}