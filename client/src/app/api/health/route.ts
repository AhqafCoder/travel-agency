import mongoose from "mongoose";
import { ok, handle } from "@/server/lib/http";

const DB_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

/** GET /api/health — liveness + DB readiness probe. */
export const GET = handle(async () => {
  const dbState = mongoose.connection.readyState;
  return ok({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: DB_STATES[dbState] ?? "unknown",
  });
});
