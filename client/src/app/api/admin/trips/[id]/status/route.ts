import { Trip } from "@/server/models/Trip";
import { ok, fail, body, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** PATCH /api/admin/trips/:id/status — DRAFT | PUBLISHED | ARCHIVED. */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const { status } = await body<{ status?: string }>(req);
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!status || !allowed.includes(status)) return fail(`status must be one of ${allowed.join(", ")}`, 400);
  const trip = await Trip.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!trip) return fail("Trip not found", 404);
  return ok(trip);
});
