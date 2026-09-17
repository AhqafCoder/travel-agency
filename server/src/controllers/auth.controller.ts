import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../lib/jwt.js";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface SigninBody {
  email?: string;
  password?: string;
}

/** Shape returned to the client — never exposes passwordHash. */
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

function signinResponse(user: Awaited<ReturnType<typeof publicUser>>) {
  const token = signToken({
    sub: String(user._id),
    role: user.role,
    email: user.email,
  });
  return { token, user };
}

/** POST /api/auth/register — create an account and return a JWT. */
export async function register(
  req: Request<object, object, SignupBody>,
  res: Response
): Promise<void> {
  const { name, email, password, phone } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({
      success: false,
      error: "Name, email and password are required",
    });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({
      success: false,
      error: "Password must be at least 8 characters",
    });
    return;
  }

  const existing = await User.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    res.status(409).json({ success: false, error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || undefined,
    passwordHash,
  });

  res.status(201).json({ success: true, data: signinResponse(publicUser(user)) });
}

/** POST /api/auth/login — verify credentials and return a JWT. */
export async function login(
  req: Request<object, object, SigninBody>,
  res: Response
): Promise<void> {
  const { email, password } = req.body ?? {};

  if (!email?.trim() || !password) {
    res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
    return;
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, error: "Invalid email or password" });
    return;
  }

  res.json({ success: true, data: signinResponse(publicUser(user)) });
}

/** GET /api/auth/me — current user from the Authorization header. */
export async function me(_req: Request, res: Response): Promise<void> {
  const userId = res.locals.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ success: false, error: "User not found" });
    return;
  }

  res.json({ success: true, data: publicUser(user) });
}