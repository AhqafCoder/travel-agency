import { Coupon } from "@/server/models/Coupon";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const coupon = await Coupon.findById(id).lean();
  if (!coupon) return fail("Coupon not found", 404);
  return ok(coupon);
});

export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const coupon = await Coupon.findByIdAndUpdate(id, { $set: await body(req) }, { new: true, runValidators: true }).lean();
  if (!coupon) return fail("Coupon not found", 404);
  return ok(coupon);
});

export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) return fail("Coupon not found", 404);
  return ok({ deleted: id });
});
