import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../models/enums.js";
import { verifyToken, type JwtPayload } from "../lib/jwt.js";

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

/**
 * Auth guard — validates a JWT and attaches the verified payload to
 * `res.locals.user`. The identity (id, role, email) comes from the token
 * so we avoid a DB hit on every request. Routes that need the full User
 * document should look it up themselves.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyToken<JwtPayload>(token);
    res.locals.user = {
      id: payload.sub,
      role: payload.role as UserRole,
      email: payload.email,
    };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user as AuthUser | undefined;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }
    next();
  };
}