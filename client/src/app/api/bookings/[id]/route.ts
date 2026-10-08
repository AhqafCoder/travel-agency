import { Booking } from "@/server/models/Booking";
import { ok, fail, handle, requireAuth } from "@/server/lib/http";

/** GET /api/bookings/:id — full booking detail (caller must own it). */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  const auth = await requireAuth(req);
  const { id } = await params;
  const query: Record<string, unknown> = { _id: id };
  // customers may only read their own bookings; staff can read any
  if (!["SUPER_ADMIN", "ADMIN", "OPERATIONS", "EDITOR"].includes(auth.role)) {
    query.userId = auth.id;
  }
  const booking = await Booking.findOne(query)
    .populate("tripId")
    .populate("departureId")
    .populate("userId", "name email phone avatar")
    .lean();
  if (!booking) return fail("Booking not found", 404);
  return ok(booking);
});
