/**
 * Store — the single source of truth for products, prices and shipping.
 *
 * Every price, product name and note used anywhere on the site (collection
 * cards, store catalog, product pages, cart, checkout) reads from here, so a
 * price change is a one-line edit (MASTER-PLAN §6.4 / §11).
 *
 * Data model is intentionally flat and framework-free so it can be imported by
 * both server components (store pages, sitemap, JSON-LD) and client components
 * (cart, checkout) without a fetch.
 */

export type CivilizationKey = "egypt" | "babylon" | "greece" | "china";

export type Product = {
  slug: CivilizationKey;
  /** Display price in SAR (whole number). */
  price: number;
  /** Millilitres — shown on the product card and detail page. */
  sizeMl: number;
  /** Card / detail imagery (896×1200 portrait). */
  image: string;
  /** Full-bleed civilization artwork used by the story section. */
  civilization: string;
  /** Accent colour for the collection card backdrop. */
  accent: string;
};

export const products: Product[] = [
  {
    slug: "egypt",
    price: 350,
    sizeMl: 50,
    image: "/products/1.jpg",
    civilization: "/images/sections/egypt_hero.png",
    accent: "#cd9e61",
  },
  {
    slug: "babylon",
    price: 350,
    sizeMl: 50,
    image: "/products/2.jpg",
    civilization: "/images/sections/babylon_hero.png",
    accent: "#b07a4a",
  },
  {
    slug: "greece",
    price: 520,
    sizeMl: 50,
    image: "/products/3.jpg",
    civilization: "/images/sections/greece_hero.png",
    accent: "#e8e2d4",
  },
  {
    slug: "china",
    price: 520,
    sizeMl: 50,
    image: "/products/4.jpg",
    civilization: "/images/sections/china_hero.png",
    accent: "#7fa3c4",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const FREE_SHIPPING_THRESHOLD = 500;

export function formatPrice(value: number): string {
  return value.toLocaleString("en-US");
}
