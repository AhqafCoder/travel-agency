import { Review } from "@/server/models/Review";
import { ok, fail, body, handle, requireRole } from "@/server/lib/http";
import { refreshTripRating } from "@/server/services/review.service";
import { UserRole } from "@/server/models/enums";

const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** PATCH /api/admin/reviews/:id/status — approve/reject; recomputes the trip rating. */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...EDITOR);
  const { id } = await params;
  const { status, adminNote } = await body<{ status?: string; adminNote?: string }>(req);
  const allowed = ["PENDING", "APPROVED", "REJECTED"];
  if (!status || !allowed.includes(status)) return fail("Invalid status", 400);

  const update: Record<string, unknown> = { status };
  if (adminNote) update.adminNote = adminNote;
  const review = await Review.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!review) return fail("Review not found", 404);

  await refreshTripRating(String(review.tripId));
  return ok(review);
});
