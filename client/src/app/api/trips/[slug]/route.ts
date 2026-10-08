import { ok, fail, handle } from "@/server/lib/http";
import { getTripBySlugOrId } from "@/server/services/public.service";

/** GET /api/trips/:slug — accepts slug or id. */
export const GET = handle<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const trip = await getTripBySlugOrId(slug);
  if (!trip) return fail("Trip not found", 404);
  return ok(trip);
});
