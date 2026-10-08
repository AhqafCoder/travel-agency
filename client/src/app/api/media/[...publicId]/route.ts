import { ok, fail, handle, requireRole } from "@/server/lib/http";
import { deleteFromCloudinary } from "@/server/lib/cloudinary";
import { UserRole } from "@/server/models/enums";

const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/** DELETE /api/media/:publicId — publicId may contain slashes. */
export const DELETE = handle<{ publicId: string[] }>(async (req, { params }) => {
  await requireRole(req, ...ADMIN_ROLES);
  const { publicId } = await params;
  const decoded = decodeURIComponent(publicId.join("/"));
  if (!decoded) return fail("publicId is required", 400);
  await deleteFromCloudinary(decoded);
  return ok({ deleted: decoded });
});
