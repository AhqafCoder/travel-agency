import { ok, handle } from "@/server/lib/http";
import { searchTripsPublic } from "@/server/services/public.service";

/** GET /api/trips/search?q=... — Mongo $text search. */
export const GET = handle(async (req) => {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return ok(await searchTripsPublic(q));
});
