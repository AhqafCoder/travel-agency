import { Destination } from "@/server/models/Destination";
import { ok, fail, handle } from "@/server/lib/http";
import { getTripsByDestinationPublic } from "@/server/services/public.service";

/** GET /api/trips/destination/:destinationId */
export const GET = handle<{ destinationId: string }>(async (_req, { params }) => {
  const { destinationId } = await params;
  const destination = await Destination.findById(destinationId).lean();
  if (!destination) return fail("Destination not found", 404);
  return ok(await getTripsByDestinationPublic(destinationId));
});
