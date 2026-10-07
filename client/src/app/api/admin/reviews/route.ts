import { Review } from "@/server/models/Review";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** GET /api/admin/reviews — filter by status. */
export const GET = handle(async (req) => {
  await requireRole(req, ...EDITOR);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  if (sp.get("status")) filter.status = sp.get("status");
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("userId", "name email avatar")
      .populate("tripId", "title slug coverImage")
      .lean(),
    Review.countDocuments(filter),
  ]);
  // client-friendly aliases (review.user / review.trip)
  return ok(data.map((r) => ({ ...r, user: r.userId, trip: r.tripId })),
    { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
