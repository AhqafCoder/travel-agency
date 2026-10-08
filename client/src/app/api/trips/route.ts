import { ok, handle } from "@/server/lib/http";
import { listTripsPublic } from "@/server/services/public.service";

/** GET /api/trips — filters: search, tripType, difficulty, destination, price/duration ranges, featured, trending, sort, page, pageSize. */
export const GET = handle(async (req) => {
  const sp = new URL(req.url).searchParams;
  const { data, meta } = await listTripsPublic(Object.fromEntries(sp.entries()));
  return ok(data, meta);
});
