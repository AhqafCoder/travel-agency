import { Coupon } from "@/server/models/Coupon";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    Coupon.find({}).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    Coupon.countDocuments({}),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});

export const POST = handle(async (req) => {
  await requireRole(req, ...OPS);
  const payload = await body<Record<string, unknown>>(req);
  const coupon = await Coupon.create({ ...payload, code: String(payload.code ?? "").toUpperCase() });
  return created(coupon);
});
