import { Departure } from "@/server/models/Departure";
import { ok, created, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/trips/:id/departures */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  return ok(await Departure.find({ tripId: id }).sort({ startDate: 1 }).lean());
});

/** POST /api/admin/trips/:id/departures */
export const POST = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const payload = await body<Record<string, unknown>>(req);
  const departure = await Departure.create({
    ...payload,
    tripId: id,
    bookedSeats: 0,
    availableSeats: Number(payload.capacity ?? 20),
  });
  return created(departure);
});
