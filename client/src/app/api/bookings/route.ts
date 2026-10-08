import { Booking } from "@/server/models/Booking";
import { ok, created, fail, body, handle, requireAuth } from "@/server/lib/http";
import { createBooking } from "@/server/services/booking.service";

/** GET /api/bookings — the caller's bookings. */
export const GET = handle(async (req) => {
  const auth = await requireAuth(req);
  const bookings = await Booking.find({ userId: auth.id })
    .populate({
      path: "tripId",
      select: "title slug coverImage durationDays tripType basePrice discountedPrice destinationId",
      populate: { path: "destinationId", select: "name slug state" },
    })
    .populate("departureId", "startDate endDate meetingPoint meetingTime status price")
    .sort({ createdAt: -1 })
    .lean();
  // client-friendly aliases (booking.trip / booking.departure)
  return ok(bookings.map((b) => ({ ...b, trip: b.tripId, departure: b.departureId })));
});

/** POST /api/bookings — create a booking with atomic seat reservation. */
export const POST = handle(async (req) => {
  const auth = await requireAuth(req);
  const { tripId, departureId, travellers, couponCode, notes } = await body<{
    tripId?: string;
    departureId?: string;
    travellers?: unknown[];
    couponCode?: string;
    notes?: string;
  }>(req);

  if (!tripId || !departureId || !Array.isArray(travellers) || travellers.length === 0) {
    return fail("tripId, departureId and travellers[] are required", 400);
  }

  const booking = await createBooking({
    userId: auth.id,
    tripId,
    departureId,
    travellers: travellers as Parameters<typeof createBooking>[0]["travellers"],
    couponCode,
    notes,
  });
  return created(booking);
});
