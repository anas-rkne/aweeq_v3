import type { MetadataRoute } from "next";
import { products } from "@/config/store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://3weeq.com";

/**
 * Sitemap — home + store + the four product pages, in both locales
 * (MASTER-PLAN §6.9 / §11). `alternates.languages` wires hreflang so the AR
 * and EN variants point at each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ar", "en"] as const;
  const lastModified = new Date();

  const staticPages = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: locale === "ar" ? 1 : 0.9,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/${locale}/store`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar/store`,
          en: `${SITE_URL}/en/store`,
        },
      },
    },
  ]);

  const productPages = locales.flatMap((locale) =>
    products.map((p) => ({
      url: `${SITE_URL}/${locale}/store/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar/store/${p.slug}`,
          en: `${SITE_URL}/en/store/${p.slug}`,
        },
      },
    }))
  );

  return [...staticPages, ...productPages];
}
