import { Lead } from "@/server/models/Lead";
import { ok, fail, handle, requireRole, body } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];
const SU: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const GET = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const lead = await Lead.findById(id).lean();
  if (!lead) return fail("Lead not found", 404);
  return ok(lead);
});

export const PATCH = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...OPS);
  const { id } = await params;
  const { status, notes } = await body<{ status?: string; notes?: string }>(req);
  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;
  const lead = await Lead.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!lead) return fail("Lead not found", 404);
  return ok(lead);
});

export const DELETE = handle<{ id: string }>(async (req, { params }) => {
  await requireRole(req, ...SU);
  const { id } = await params;
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) return fail("Lead not found", 404);
  return ok({ deleted: id });
});
