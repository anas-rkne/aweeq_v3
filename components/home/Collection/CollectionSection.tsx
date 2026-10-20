import { getTranslations } from "next-intl/server";
import { products } from "@/config/store";
import ProductCard from "@/components/store/ProductCard";

/**
 * The Collection — four civilizations, four scents (MASTER-PLAN §6.4). A grid
 * of product cards (4 desktop / 2 tablet / 1 phone) with the description and
 * price always visible and a one-tap add. The grid is for comparing, not a
 * swipe showreel.
 */
export default async function CollectionSection() {
  const t = await getTranslations("Store");

  return (
    <section id="collection" className="relative bg-navy-ink py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-secondary text-small tracking-[0.35em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-primary text-display leading-[1.08] text-beige">
            {t("title")}
          </h2>
          <p className="mt-4 text-body text-beige/70">{t("subtitle")}</p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
