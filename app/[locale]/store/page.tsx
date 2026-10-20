import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { products } from "@/config/store";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Store" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Store" });

  return (
    <main className="bg-navy-ink py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-secondary text-small tracking-[0.35em] text-gold">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 font-primary text-display leading-[1.08] text-beige">
            {t("title")}
          </h1>
          <p className="mt-4 text-body text-beige/70">{t("subtitle")}</p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
