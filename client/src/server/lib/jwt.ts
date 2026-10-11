import jwt, { type SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET && process.env.NODE_ENV === "production") {
  // Fail fast instead of silently signing tokens with a publicly-known constant.
  throw new Error("JWT_SECRET environment variable must be set in production");
}

const FALLBACK = SECRET ?? "dev-secret-change-me";

export interface JwtPayload {
  sub: string;   // user _id
  role: string;
  email: string;
}

export function signToken(payload: JwtPayload, options: SignOptions = {}): string {
  return jwt.sign(payload, FALLBACK, { expiresIn: "7d", ...options });
}

export function verifyToken<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, FALLBACK) as T;
}
