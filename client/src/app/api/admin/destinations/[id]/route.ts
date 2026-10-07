import { Destination } from "@/server/models/Destination";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
const EDITOR: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...EDITOR);
  const { id } = await params;
  const dest = await Destination.findById(id).lean();
  if (!dest) return fail("Destination not found", 404);
  return ok(dest);
});

export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const dest = await Destination.findByIdAndUpdate(id, { $set: await body(req) }, { new: true, runValidators: true }).lean();
  if (!dest) return fail("Destination not found", 404);
  return ok(dest);
});

export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const dest = await Destination.findByIdAndDelete(id);
  if (!dest) return fail("Destination not found", 404);
  return ok({ deleted: id });
});
