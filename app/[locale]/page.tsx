import { setRequestLocale } from "next-intl/server";
import HeroWrapper from "./HeroWrapper"; // استيراد الملف الجديد
import ProductCollection from "@/components/home/Collection/ProductCollection";
import CraftsmanshipSection from "@/components/home/Craftsmanship/CraftsmanshipSection";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col">
      <HeroWrapper /> {/* استخدام المكون الجديد هنا */}
      <ProductCollection />
      <CraftsmanshipSection />
    </main>
  );
}