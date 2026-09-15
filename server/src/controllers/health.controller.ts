import type { Request, Response } from "express";
import mongoose from "mongoose";

const DB_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

/** GET /api/health — liveness + DB readiness probe. */
export function health(_req: Request, res: Response): void {
  const dbState = mongoose.connection.readyState;

  res.json({
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: DB_STATES[dbState] ?? "unknown",
    },
  });
}