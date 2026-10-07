import { Departure } from "@/server/models/Departure";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/departures — all departures across trips. */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const query: Record<string, unknown> = {};
  const status = sp.get("status");
  if (status && status !== "ALL") query.status = status;

  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 50);

  const [data, total] = await Promise.all([
    Departure.find(query).sort({ startDate: 1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("tripId", "title slug coverImage").lean(),
    Departure.countDocuments(query),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
