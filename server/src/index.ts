import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./db/mongoose.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Connect to MongoDB in parallel — the HTTP server stays up even if the
  // DB is unreachable so the /api/health endpoint reports readiness.
  connectDB().catch((error) => {
    console.error("⚠️  MongoDB connection failed (server still running):", (error as Error).message);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});