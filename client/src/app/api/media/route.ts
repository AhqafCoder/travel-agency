import { ok, fail, handle, requireRole } from "@/server/lib/http";
import { cloudinary } from "@/server/lib/cloudinary";
import { UserRole } from "@/server/models/enums";

const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS, UserRole.EDITOR];

/**
 * GET /api/media?folder=trips&cursor=... — list assets uploaded under
 * "editmytrips/" (optionally a subfolder) straight from the Cloudinary
 * Admin API. Returns a page of { url, publicId, width, height, format, bytes }
 * plus a cursor for the next page.
 */
export const GET = handle(async (req) => {
  await requireRole(req, ...ADMIN_ROLES);
  const sp = new URL(req.url).searchParams;
  const folder = (sp.get("folder") ?? "").replace(/[^a-zA-Z0-9\-\/]/g, "").replace(/^\/|\/$/g, "");
  const cursor = sp.get("cursor") ?? undefined;
  const prefix = folder ? `editmytrips/${folder}` : "editmytrips/";

  try {
    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix,
      max_results: 30,
      ...(cursor ? { next_cursor: cursor } : {}),
    });
    const assets = (result.resources ?? []).map((r: {
      public_id: string; secure_url: string; width: number; height: number; format: string; bytes: number; created_at: string;
    }) => ({
      publicId: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
    }));
    return ok(assets, { nextCursor: result.next_cursor ?? null, rateLimitRemaining: result.rate_limit_remaining ?? null });
  } catch (err) {
    const status = (err as { http_code?: number })?.http_code;
    if (status === 401 || status === 403) return fail("Cloudinary credentials are not authorized for listing", 502);
    if (status === 420) return fail("Cloudinary rate limit reached, try again shortly", 429);
    return fail("Failed to list media", 502);
  }
});
