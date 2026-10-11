import type { MetadataRoute } from "next";
import { listTripsPublic, listDestinationsPublic, listStoriesPublic } from "@/server/services/public.service";

const SITE_URL = "https://editmytrips.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/trips",
    "/destinations",
    "/experiences",
    "/stories",
    "/community",
    "/about",
    "/contact",
    "/faqs",
    "/careers",
    "/terms",
    "/privacy-policy",
    "/refund-policy",
    "/cancellation-policy",
  ].map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));

  try {
    const [trips, destinations, stories] = await Promise.all([
      listTripsPublic({ pageSize: "500" }),
      listDestinationsPublic(),
      listStoriesPublic(),
    ]);
    return [
      ...staticRoutes,
      ...trips.data.map((t) => ({ url: `${SITE_URL}/trips/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
      ...destinations.map((d) => ({ url: `${SITE_URL}/destinations/${d.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...stories
        .filter((st) => st.status === "PUBLISHED")
        .map((st) => ({ url: `${SITE_URL}/stories/${st.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch {
    // DB unreachable at build/regen time — ship static routes rather than failing.
    return staticRoutes;
  }
}
