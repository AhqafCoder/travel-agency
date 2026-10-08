import { Booking } from "@/server/models/Booking";
import { ok, fail, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/bookings/:id */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const booking = await Booking.findById(id)
    .populate("userId", "name email phone avatar")
    .populate("tripId", "title coverImage slug durationDays")
    .populate("departureId")
    .lean();
  if (!booking) return fail("Booking not found", 404);
  return ok(booking);
});
