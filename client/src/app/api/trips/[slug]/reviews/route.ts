import { ok, created, body, handle, requireAuth, HttpError } from "@/server/lib/http";
import { getTripBySlugOrId } from "@/server/services/public.service";
import { createVerifiedReview } from "@/server/services/review.service";
import { listApprovedReviews } from "@/server/services/public.service";

async function resolveTripId(slugOrId: string): Promise<string> {
  const trip = await getTripBySlugOrId(slugOrId);
  if (!trip) throw new HttpError(404, "Trip not found");
  return String((trip as unknown as { _id: unknown })._id);
}

/** GET /api/trips/:slug/reviews — approved reviews only. */
export const GET = handle<{ slug: string }>(async (_req, { params }) => {
  const { slug } = await params;
  const tripId = await resolveTripId(slug);
  return ok(await listApprovedReviews(tripId));
});

/**
 * POST /api/trips/:slug/reviews — verified travellers only.
 * Requires a COMPLETED booking for this trip; the review is stored as
 * PENDING (admin approves) with verifiedBooking: true.
 */
export const POST = handle<{ slug: string }>(async (req, { params }) => {
  const auth = await requireAuth(req);
  const { slug } = await params;
  const tripId = await resolveTripId(slug);
  const payload = await body<{
    rating?: number;
    title?: string;
    content?: string;
    images?: string[];
    bookingId?: string;
  }>(req);

  const review = await createVerifiedReview({
    userId: auth.id,
    tripId,
    rating: payload.rating,
    title: payload.title,
    content: payload.content ?? "",
    images: payload.images,
    bookingId: payload.bookingId,
  });
  return created(review);
});
