import { created, fail, handle, requireAuth, HttpError } from "@/server/lib/http";
import { uploadToCloudinary } from "@/server/lib/cloudinary";
import { UserRole } from "@/server/models/enums";

const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, matches the old multer limit

/**
 * POST /api/media/upload — multipart/form-data, field "file", optional "folder".
 * Staff can upload anywhere; signed-in customers may only upload to
 * "reviews" (their post-trip review photos).
 */
export const POST = handle(async (req) => {
  const auth = await requireAuth(req);
  const form = await req.formData();
  const file = form.get("file");
  // Path-traversal-proof: only letters/digits/dashes/slashes, no leading dots.
  const rawFolder = (form.get("folder") as string | null) ?? "general";
  const folder = rawFolder.replace(/[^a-zA-Z0-9\-\/]/g, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "") || "general";

  if (!(file instanceof File)) return fail("No file provided", 400);

  if (!ADMIN_ROLES.includes(auth.role)) {
    if (folder !== "reviews") throw new HttpError(403, "Forbidden");
  }

  if (!file.type.startsWith("image/")) return fail("Only image uploads are allowed", 400);
  if (file.size > MAX_BYTES) return fail("File too large (max 10 MB)", 400);

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, folder);
  return created(result);
});
