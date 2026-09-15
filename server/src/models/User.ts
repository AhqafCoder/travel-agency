import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { UserRole } from "./enums.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    emailVerified: { type: Date },
    passwordHash: { type: String, select: false },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

export const User = model<UserDoc>("User", userSchema);