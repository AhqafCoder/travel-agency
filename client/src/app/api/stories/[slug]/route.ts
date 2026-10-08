import { ok, fail, handle } from "@/server/lib/http";
import { getStoryBySlugPublic } from "@/server/services/public.service";

/** GET /api/stories/:slug — increments view count. */
export const GET = handle<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const data = await getStoryBySlugPublic(slug);
  if (!data) return fail("Story not found", 404);
  return ok(data);
});
