import { ok, handle, requireAuth } from "@/server/lib/http";
import { getPendingReviewBookings } from "@/server/services/review.service";

/** GET /api/reviews/pending — my completed bookings awaiting a review (drives the post-trip popup). */
export const GET = handle(async (req) => {
  const auth = await requireAuth(req);
  const bookings = await getPendingReviewBookings(auth.id);
  // client-friendly alias (booking.trip)
  return ok(bookings.map((b) => ({ ...b, trip: b.tripId })));
});
