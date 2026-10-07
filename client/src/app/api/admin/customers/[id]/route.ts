import { User } from "@/server/models/User";
import { Booking } from "@/server/models/Booking";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

/** GET /api/admin/customers/:id — customer + their bookings. */
export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const user = await User.findById(id).lean();
  if (!user) return fail("User not found", 404);
  const bookings = await Booking.find({ userId: id }).sort({ createdAt: -1 }).populate("tripId", "title coverImage slug").lean();
  return ok({ user, bookings });
});

/** PATCH /api/admin/customers/:id — update role or basic info. */
export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const { role, name, phone } = await body<{ role?: string; name?: string; phone?: string }>(req);
  const update: Record<string, unknown> = {};
  if (role) update.role = role;
  if (name) update.name = name;
  if (phone) update.phone = phone;
  const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!user) return fail("User not found", 404);
  return ok(user);
});
