import { setRequestLocale } from "next-intl/server";
import NewHero3D from "@/components/home/Hero/NewHero3D";
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
      <NewHero3D />
      <ProductCollection />
      <CraftsmanshipSection />
    </main>
  );
}
