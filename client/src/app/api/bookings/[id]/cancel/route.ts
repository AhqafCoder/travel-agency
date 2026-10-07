import { ok, fail, body, handle, requireAuth } from "@/server/lib/http";
import { cancelBooking } from "@/server/services/booking.service";

/** PATCH /api/bookings/:id/cancel — cancel own booking (releases seats). */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireAuth(req);
  const { id } = await params;
  const { reason } = await body<{ reason?: string }>(req);
  if (!reason) return fail("reason is required", 400);
  return ok(await cancelBooking(id, reason));
});
