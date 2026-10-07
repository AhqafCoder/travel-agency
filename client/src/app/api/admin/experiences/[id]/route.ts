import { Experience } from "@/server/models/Experience";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...EDITOR);
  const { id } = await params;
  const exp = await Experience.findById(id).populate("destinationId", "name slug").lean();
  if (!exp) return fail("Experience not found", 404);
  return ok(exp);
});

export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const exp = await Experience.findByIdAndUpdate(id, { $set: await body(req) }, { new: true, runValidators: true }).lean();
  if (!exp) return fail("Experience not found", 404);
  return ok(exp);
});

export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const exp = await Experience.findByIdAndDelete(id);
  if (!exp) return fail("Experience not found", 404);
  return ok({ deleted: id });
});
