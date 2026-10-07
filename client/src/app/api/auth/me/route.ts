import { User } from "@/server/models/User";
import { ok, fail, body, handle, requireAuth } from "@/server/lib/http";

/** GET /api/auth/me — current user from the Authorization header. */
export const GET = handle(async (req) => {
  const auth = await requireAuth(req);
  const user = await User.findById(auth.id);
  if (!user) return fail("User not found", 404);

  return ok({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
});

/** PATCH /api/auth/me — update own profile (name, phone, avatar). */
export const PATCH = handle(async (req) => {
  const auth = await requireAuth(req);
  const { name, phone, avatar } = await body<{
    name?: string;
    phone?: string;
    avatar?: string;
  }>(req);

  const update: Record<string, unknown> = {};
  if (name?.trim()) update.name = name.trim();
  if (phone !== undefined) update.phone = phone.trim() || undefined;
  if (avatar !== undefined) update.avatar = avatar || undefined;

  const user = await User.findByIdAndUpdate(auth.id, { $set: update }, { new: true });
  if (!user) return fail("User not found", 404);

  return ok({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
});
