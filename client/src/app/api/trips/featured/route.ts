import { ok, handle } from "@/server/lib/http";
import { getFeaturedTripsPublic } from "@/server/services/public.service";

/** GET /api/trips/featured */
export const GET = handle(async () => ok(await getFeaturedTripsPublic()));
