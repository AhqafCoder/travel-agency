import { ok, handle } from "@/server/lib/http";
import { getUpcomingDepartures } from "@/server/services/public.service";

/** GET /api/departures?tripId=... — future bookable departures (public). */
export const GET = handle(async (req) => {
  const tripId = new URL(req.url).searchParams.get("tripId") ?? undefined;
  return ok(await getUpcomingDepartures(tripId));
});
