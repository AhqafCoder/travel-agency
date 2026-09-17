import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env.local" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/editmytrips"),
  JWT_SECRET: z.string().default("dev-secret-change-me"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;