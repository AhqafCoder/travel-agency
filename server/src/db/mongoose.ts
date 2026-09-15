import mongoose from "mongoose";
import { env } from "../config/env.js";

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = {
  conn: null,
  promise: null,
};

/**
 * MongoDB singleton connection.
 * Reuses an in-flight connection across hot reloads in dev.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI).then((mongooseInstance) => {
      console.log(`✅ MongoDB connected: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }

  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}