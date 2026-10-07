import { User } from "@/server/models/User";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/customers */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = { role: "CUSTOMER" };
  const search = sp.get("search");
  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  }
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    User.countDocuments(filter),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
