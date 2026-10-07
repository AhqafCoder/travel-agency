import { ok, fail, handle } from "@/server/lib/http";
import { getDestinationBySlugPublic } from "@/server/services/public.service";

/** GET /api/destinations/:slug — destination + its published trips. */
export const GET = handle<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const data = await getDestinationBySlugPublic(slug);
  if (!data) return fail("Destination not found", 404);
  return ok(data);
});
