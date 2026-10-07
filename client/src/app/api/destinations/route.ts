import { ok, handle } from "@/server/lib/http";
import { listDestinationsPublic } from "@/server/services/public.service";

/** GET /api/destinations */
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  return ok(await listDestinationsPublic(Object.fromEntries(sp.entries())));
});
