import { ok, fail, handle } from "@/server/lib/http";
import { getExperienceBySlugPublic } from "@/server/services/public.service";

/** GET /api/experiences/:slug */
export const GET = handle<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const data = await getExperienceBySlugPublic(slug);
  if (!data) return fail("Experience not found", 404);
  return ok(data);
});
