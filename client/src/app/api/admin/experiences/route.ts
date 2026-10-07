import { Experience } from "@/server/models/Experience";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

export const GET = handle(async (req) => {
  await requireRole(req, ...EDITOR);
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  const search = sp.get("search");
  if (search) filter.title = { $regex: search, $options: "i" };
  if (sp.get("status")) filter.status = sp.get("status");
  const pageNum = Math.max(1, Number(sp.get("page")) || 1);
  const pageSizeNum = Math.min(100, Number(sp.get("pageSize")) || 20);
  const [data, total] = await Promise.all([
    Experience.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).populate("destinationId", "name slug").lean(),
    Experience.countDocuments(filter),
  ]);
  // client-friendly alias (experience.destination)
  return ok(data.map((e) => ({ ...e, destination: e.destinationId })),
    { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});

export const POST = handle(async (req) => {
  await requireRole(req, ...OPS);
  const payload = await body<Record<string, unknown>>(req);
  if (!payload.slug && payload.title) {
    payload.slug = String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  return created(await Experience.create(payload));
});
