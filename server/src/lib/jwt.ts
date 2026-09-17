import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

const SECRET = env.JWT_SECRET;

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
