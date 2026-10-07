import { Destination } from "@/server/models/Destination";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** GET /api/admin/destinations */
export const GET = handle(async (req) => {
  await requireRole(req, ...EDITOR);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  const search = sp.get("search");
  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { state: { $regex: search, $options: "i" } }];
  }
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 50);
  const [data, total] = await Promise.all([
    Destination.find(filter).sort({ name: 1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    Destination.countDocuments(filter),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});

/** POST /api/admin/destinations */
export const POST = handle(async (req) => {
  await requireRole(req, ...OPS);
  const payload = await body<Record<string, unknown>>(req);
  if (!payload.slug && payload.name) {
    payload.slug = String(payload.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  return created(await Destination.create(payload));
});
