import { Story } from "@/server/models/Story";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** GET /api/admin/stories */
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
    Story.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).populate("authorId", "name avatar").lean(),
    Story.countDocuments(filter),
  ]);
  // client-friendly alias (story.author)
  return ok(data.map((st) => ({ ...st, author: st.authorId })),
    { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) });
});

/** POST /api/admin/stories — author is the caller. */
export const POST = handle(async (req) => {
  const auth = await requireRole(req, ...EDITOR);
  const payload = await body<Record<string, unknown>>(req);
  if (!payload.slug && payload.title) {
    payload.slug = String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  return created(await Story.create({ ...payload, authorId: auth.id }));
});
