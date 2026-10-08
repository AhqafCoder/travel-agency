import { Review } from "@/server/models/Review";
import { Booking } from "@/server/models/Booking";
import { Trip } from "@/server/models/Trip";
import { ReviewStatus } from "@/server/models/enums";
import { connectDB } from "@/server/db/mongoose";

/** Server components bypass route handlers — make sure Mongo is connected. */
async function ensureDB() {
  await connectDB();
}

/** Recompute a trip's rating/reviewCount from its APPROVED reviews. */
export async function refreshTripRating(tripId: string): Promise<void> {
  await ensureDB();
  const approved = await Review.find({ tripId, status: ReviewStatus.APPROVED }).select("rating").lean();
  const count = approved.length;
  const avg = count === 0 ? 0 : Math.round((approved.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10;
  await Trip.updateOne({ _id: tripId }, { $set: { rating: avg, reviewCount: count } });
}

/**
 * The only path to create a review: the user must hold a COMPLETED booking
 * for this trip. The review is born PENDING (admin approves) and always
 * flagged as a verified booking.
 */
export async function createVerifiedReview(input: {
  userId: string;
  tripId: string;
  rating?: number;
  title?: string;
  content: string;
  images?: string[];
  bookingId?: string;
}) {
  await ensureDB();
  const { userId, tripId, rating, title, content, images, bookingId } = input;

  if (!rating || rating < 1 || rating > 5 || !content?.trim()) {
    const err = new Error("rating (1-5) and content are required") as Error & { status: number };
    err.status = 400;
    throw err;
  }

  // The completed booking that earns the right to review.
  const bookingFilter: Record<string, unknown> = {
    userId,
    tripId,
    bookingStatus: "COMPLETED",
  };
  if (bookingId) bookingFilter._id = bookingId;

  const booking = await Booking.findOne(bookingFilter).sort({ createdAt: -1 }).lean();
  if (!booking) {
    const err = new Error(
      "Only travellers who have completed this trip can leave a review"
    ) as Error & { status: number };
    err.status = 403;
    throw err;
  }

  const duplicate = await Review.findOne({ bookingId: booking._id }).lean();
  if (duplicate) {
    const err = new Error("You have already reviewed this trip") as Error & { status: number };
    err.status = 409;
    throw err;
  }

  const review = await Review.create({
    userId,
    tripId,
    bookingId: booking._id,
    rating,
    title: title?.trim() || undefined,
    content: content.trim(),
    images: images?.filter(Boolean) ?? [],
    status: ReviewStatus.PENDING,
    verifiedBooking: true,
  });

  return review;
}

/** Completed bookings of a user that have no review yet — fuels the post-trip popup. */
export async function getPendingReviewBookings(userId: string) {
  await ensureDB();
  const completed = await Booking.find({ userId, bookingStatus: "COMPLETED" })
    .sort({ updatedAt: -1 })
    .populate("tripId", "title slug coverImage durationDays tripType destinationId")
    .lean();

  const withReview = await Review.find(
    { userId, bookingId: { $in: completed.map((b) => b._id) } },
    { bookingId: 1 }
  ).lean();
  const reviewed = new Set(withReview.map((r) => String(r.bookingId)));

  return completed.filter((b) => !reviewed.has(String(b._id)));
}
