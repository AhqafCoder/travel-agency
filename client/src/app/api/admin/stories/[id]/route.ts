import { Story } from "@/server/models/Story";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...EDITOR);
  const { id } = await params;
  const story = await Story.findById(id).populate("authorId", "name avatar").lean();
  if (!story) return fail("Story not found", 404);
  return ok(story);
});

export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...EDITOR);
  const { id } = await params;
  const payload = await body<Record<string, unknown>>(req);
  if (payload.status === "PUBLISHED" && !payload.publishedAt) payload.publishedAt = new Date();
  const story = await Story.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean();
  if (!story) return fail("Story not found", 404);
  return ok(story);
});

export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const story = await Story.findByIdAndDelete(id);
  if (!story) return fail("Story not found", 404);
  return ok({ deleted: id });
});
