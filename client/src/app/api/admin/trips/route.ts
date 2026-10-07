import { Trip } from "@/server/models/Trip";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
function escapeRegExp(v: string) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** GET /api/admin/trips */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  if (sp.get("search")) {
    const rx = escapeRegExp(sp.get("search") as string);
    filter.$or = [{ title: { $regex: rx, $options: "i" } }, { slug: { $regex: rx, $options: "i" } }];
  }
  if (sp.get("status")) filter.status = sp.get("status");
  if (sp.get("tripType")) filter.tripType = sp.get("tripType");

  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Math.max(1, Number(sp.get("pageSize")) || 20));

  const [data, total] = await Promise.all([
    Trip.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum)
      .populate("destinationId", "name slug state").lean(),
    Trip.countDocuments(filter),
  ]);
  return ok(data, { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});

/** POST /api/admin/trips */
export const POST = handle(async (req) => {
  await requireRole(req, ...OPS);
  const payload = await body<Record<string, unknown>>(req);
  if (!payload.slug && payload.title) payload.slug = slugify(String(payload.title));
  const trip = await Trip.create(payload);
  return created(trip);
});
