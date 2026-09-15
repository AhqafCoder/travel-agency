import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../models/enums.js";

/**
 * Auth guard — validates a Bearer token and attaches the user to res.locals.
 * Full JWT/session wiring lands in Phase 10; for now it reads an optional
 * `Authorization: Bearer <userId>` header so dev/seed flows can run.
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
  // TODO(Phase 10): verify JWT signature against JWT_SECRET + load user from DB.
  res.locals.user = { id: token, role: "CUSTOMER" as UserRole };
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user as { role: UserRole } | undefined;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }
    next();
  };
}