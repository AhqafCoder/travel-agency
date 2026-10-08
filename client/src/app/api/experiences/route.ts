import { ok, handle } from "@/server/lib/http";
import { listExperiencesPublic } from "@/server/services/public.service";

/** GET /api/experiences */
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  return ok(
    await listExperiencesPublic({
      search: sp.get("search") ?? undefined,
      category: sp.get("category") ?? undefined,
      destination: sp.get("destination") ?? undefined,
    })
  );
});
