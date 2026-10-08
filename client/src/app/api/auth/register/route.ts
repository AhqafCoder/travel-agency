import bcrypt from "bcryptjs";
import { User } from "@/server/models/User";
import { signToken } from "@/server/lib/jwt";
import { ok, created, fail, body, handle } from "@/server/lib/http";

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  emailVerified?: Date | null;
  createdAt: Date;
}) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

/** POST /api/auth/register — create an account and return a JWT. */
export const POST = handle(async (req) => {
  const { name, email, password, phone } = await body<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  }>(req);

  if (!name?.trim() || !email?.trim() || !password) {
    return fail("Name, email and password are required", 400);
  }
  if (password.length < 8) {
    return fail("Password must be at least 8 characters", 400);
  }

  const existing = await User.findOne({ email: email.trim().toLowerCase() });
  if (existing) return fail("Email already registered", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || undefined,
    passwordHash,
  });

  const pu = publicUser(user);
  const token = signToken({ sub: String(pu._id), role: pu.role, email: pu.email });
  return created({ token, user: pu });
});
