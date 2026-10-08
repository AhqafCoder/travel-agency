import mongoose, { model, Schema, Types, type Model, type InferSchemaType } from "mongoose";
import { UserRole } from "./enums";

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

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) ?? model<UserDoc>("User", userSchema);