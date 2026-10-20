import { products } from "@/config/store";

/**
 * JSON-LD structured data — ItemList of the four products with an Offer, so
 * search engines understand the store (MASTER-PLAN §6.9). Built as plain JSON
 * (no extra dependency) and rendered as a server component.
 */
export default function StoreJsonLd() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://3weeq.com";

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.slug,
        image: `${SITE_URL}${p.image}`,
        description: p.slug,
        brand: { "@type": "Brand", name: "3WEEQ" },
        offers: {
          "@type": "Offer",
          priceCurrency: "AED",
          price: p.price,
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/store/${p.slug}`,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}
