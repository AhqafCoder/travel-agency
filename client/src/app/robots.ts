import type { MetadataRoute } from "next";

const SITE_URL = "https://editmytrips.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/profile", "/booking"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
