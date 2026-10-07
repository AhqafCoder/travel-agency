import { Review } from "@/server/models/Review";
import { ok, fail, handle, requireRole } from "@/server/lib/http";
import { refreshTripRating } from "@/server/services/review.service";
import { UserRole } from "@/server/models/enums";

const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

/** DELETE /api/admin/reviews/:id — recomputes the trip rating after removal. */
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) return fail("Review not found", 404);
  await refreshTripRating(String(review.tripId));
  return ok({ deleted: id });
});
