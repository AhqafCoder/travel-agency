import { ok, handle } from "@/server/lib/http";
import { listStoriesPublic } from "@/server/services/public.service";

/** GET /api/stories */
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  return ok(
    await listStoriesPublic({
      search: sp.get("search") ?? undefined,
      category: sp.get("category") ?? undefined,
      featured: sp.get("featured") ?? undefined,
    })
  );
});
