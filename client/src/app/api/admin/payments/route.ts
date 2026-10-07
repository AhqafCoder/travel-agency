import { Payment } from "@/server/models/Payment";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/payments — payment ledger. */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const query: Record<string, unknown> = {};
  const status = sp.get("status");
  if (status && status !== "ALL") query.status = status;
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    Payment.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("bookingId", "bookingNumber bookingStatus").lean(),
    Payment.countDocuments(query),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
