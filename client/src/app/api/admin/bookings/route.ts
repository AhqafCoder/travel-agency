import { Booking } from "@/server/models/Booking";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/bookings — filterable booking table. */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  const search = sp.get("search");
  if (search) filter.bookingNumber = { $regex: search, $options: "i" };
  if (sp.get("status")) filter.bookingStatus = sp.get("status");
  if (sp.get("paymentStatus")) filter.paymentStatus = sp.get("paymentStatus");

  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);

  const [data, total] = await Promise.all([
    Booking.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("userId", "name email phone avatar")
      .populate("tripId", "title coverImage slug")
      .populate("departureId", "startDate endDate price meetingPoint")
      .lean(),
    Booking.countDocuments(filter),
  ]);
  // client-friendly aliases (booking.user / booking.trip)
  return ok(data.map((b) => ({ ...b, user: b.userId, trip: b.tripId })),
    { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
