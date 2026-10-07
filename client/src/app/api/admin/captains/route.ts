import { Captain } from "@/server/models/Captain";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** GET /api/admin/captains — captains with their user profile. */
export const GET = handle(async (req) => {
  await requireRole(req, ...EDITOR);
  const sp = new URL(req.url).searchParams;
  const query: Record<string, unknown> = {};
  const available = sp.get("available");
  if (available === "true") query.available = true;
  if (available === "false") query.available = false;
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    Captain.find(query).sort({ rating: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("userId", "name email phone avatar").lean(),
    Captain.countDocuments(query),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});
