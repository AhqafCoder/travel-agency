import bcrypt from "bcryptjs";
import { User } from "@/server/models/User";
import { signToken } from "@/server/lib/jwt";
import { ok, fail, body, handle } from "@/server/lib/http";

/** POST /api/auth/login — verify credentials and return a JWT. */
export const POST = handle(async (req) => {
  const { email, password } = await body<{ email?: string; password?: string }>(req);

  if (!email?.trim() || !password) return fail("Email and password are required", 400);

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !user.passwordHash) return fail("Invalid email or password", 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return fail("Invalid email or password", 401);

  const token = signToken({ sub: String(user._id), role: user.role, email: user.email });
  return ok({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      avatar: user.avatar ?? undefined,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  });
});
