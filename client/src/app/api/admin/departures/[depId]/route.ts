import { Departure } from "@/server/models/Departure";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

/** PATCH /api/admin/departures/:depId */
export const PATCH = handle<{ depId: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { depId } = await params;
  const payload = await body<Record<string, unknown>>(req);
  const dep = await Departure.findByIdAndUpdate(depId, { $set: payload }, { new: true, runValidators: true }).lean();
  if (!dep) return fail("Departure not found", 404);
  return ok(dep);
});

/** DELETE /api/admin/departures/:depId */
export const DELETE = handle<{ depId: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { depId } = await params;
  const dep = await Departure.findByIdAndDelete(depId);
  if (!dep) return fail("Departure not found", 404);
  return ok({ deleted: depId });
});
