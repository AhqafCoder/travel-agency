import { Trip } from "@/server/models/Trip";
import { Departure } from "@/server/models/Departure";
import { ok, created, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

/** GET /api/admin/trips/:id */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const trip = await Trip.findById(id).populate("destinationId").populate("captainId").lean();
  if (!trip) return fail("Trip not found", 404);
  return ok(trip);
});

/** PATCH /api/admin/trips/:id — partial update. */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const payload = await body<Record<string, unknown>>(req);
  const trip = await Trip.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean();
  if (!trip) return fail("Trip not found", 404);
  return ok(trip);
});

/** DELETE /api/admin/trips/:id — also deletes its departures. */
export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const trip = await Trip.findByIdAndDelete(id);
  if (!trip) return fail("Trip not found", 404);
  await Departure.deleteMany({ tripId: id });
  return ok({ deleted: id });
});
