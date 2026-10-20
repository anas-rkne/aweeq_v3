import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://3weeq.com";

/**
 * Robots — allow everything except the checkout (an order must never be
 * indexed — MASTER-PLAN §6.9).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/store/checkout" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
