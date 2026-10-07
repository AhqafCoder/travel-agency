import jwt, { type SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export interface JwtPayload {
  sub: string;   // user _id
  role: string;
  email: string;
}

export function signToken(payload: JwtPayload, options: SignOptions = {}): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d", ...options });
}

export function verifyToken<T extends object = JwtPayload>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
