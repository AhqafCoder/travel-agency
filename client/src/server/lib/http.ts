import { NextResponse } from "next/server";
import { verifyToken, type JwtPayload } from "@/server/lib/jwt";
import type { UserRole } from "@/server/models/enums";
import { connectDB } from "@/server/db/mongoose";

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Success envelope: { success: true, data, meta? } */
export function ok(data: unknown, meta?: unknown): NextResponse {
  return NextResponse.json(meta !== undefined ? { success: true, data, meta } : { success: true, data });
}

export function created(data: unknown, message?: string): NextResponse {
  return NextResponse.json(
    message ? { success: true, message, data } : { success: true, data },
    { status: 201 }
  );
}

/** Error envelope: { success: false, error } */
export function fail(error: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error }, { status });
}

/** Parse the Bearer token without enforcement. Returns null when missing/invalid. */
export function getAuth(req: Request): AuthUser | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  if (!token) return null;
  try {
    const payload = verifyToken<JwtPayload>(token);
    return { id: payload.sub, role: payload.role as UserRole, email: payload.email };
  } catch {
    return null;
  }
}

/** Throws 401 when the request has no valid Bearer token. */
export async function requireAuth(req: Request): Promise<AuthUser> {
  const user = getAuth(req);
  if (!user) throw new HttpError(401, "Unauthorized");
  return user;
}

/** Throws 401/403 unless the caller holds one of the given roles. */
export async function requireRole(req: Request, ...roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!roles.includes(user.role)) throw new HttpError(403, "Forbidden");
  return user;
}

/** Safely parse a JSON body ({} on parse failure). */
export async function body<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

type Ctx<P> = { params: Promise<P> };

/**
 * Wraps a route handler: connects MongoDB, converts thrown errors (including
 * models' `.status` errors and HttpError) into the { success:false, error }
 * envelope. Keeps every route.ts file free of try/catch noise.
 */
export function handle<P = Record<string, never>>(
  fn: (req: Request, ctx: Ctx<P>) => Promise<Response>
) {
  return async (req: Request, ctx: Ctx<P>): Promise<Response> => {
    try {
      await connectDB();
      return await fn(req, ctx);
    } catch (err) {
      if ((err as { name?: string })?.name === "CastError") {
        return fail("Invalid identifier", 400);
      }
      const status = (err as { status?: number })?.status ?? 500;
      const message = err instanceof Error ? err.message : "Internal server error";
      if (status >= 500) console.error("❌ API error:", err);
      return fail(message, status);
    }
  };
}
