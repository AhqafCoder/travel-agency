import { Booking } from "@/server/models/Booking";
import { Departure } from "@/server/models/Departure";
import { ok, fail, body, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/**
 * PATCH /api/admin/bookings/:id/status — change booking status.
 * Cancelling releases the reserved seats back to the departure
 * (only on the CANCELLED transition, never double-released).
 */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const { bookingStatus, cancelReason } = await body<{ bookingStatus?: string; cancelReason?: string }>(req);
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
  if (!bookingStatus || !allowed.includes(bookingStatus)) return fail("Invalid bookingStatus", 400);

  const current = await Booking.findById(id).lean();
  if (!current) return fail("Booking not found", 404);

  const update: Record<string, unknown> = { bookingStatus };
  if (cancelReason) update.cancelReason = cancelReason;

  const booking = await Booking.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();

  if (bookingStatus === "CANCELLED" && current.bookingStatus !== "CANCELLED") {
    await Departure.updateOne(
      { _id: current.departureId },
      { $inc: { availableSeats: current.travellersCount, bookedSeats: -current.travellersCount } }
    );
  }

  return ok(booking);
});
