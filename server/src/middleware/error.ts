import type { NextFunction, Request, Response } from "express";

/** 404 handler — mounted after all routes. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/** Central error handler — last middleware. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = (err as { status?: number })?.status ?? 500;
  const message =
    err instanceof Error ? err.message : "Internal server error";

  if (status >= 500) {
    console.error("❌ Unhandled error:", err);
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}