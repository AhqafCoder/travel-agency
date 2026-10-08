import mongoose, { model, Schema, Types, type Model, type InferSchemaType } from "mongoose";
import { TRIP_TYPES } from "./enums";

const captainSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tripsLed: { type: Number, default: 0 },
    specializations: [{ type: String, enum: TRIP_TYPES }],
    languages: [{ type: String }],
    experience: { type: Number, default: 0 }, // years
    avatar: { type: String },
    documents: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type CaptainDoc = InferSchemaType<typeof captainSchema> & {
  _id: Types.ObjectId;
};

export const Captain: Model<CaptainDoc> =
  (mongoose.models.Captain as Model<CaptainDoc>) ?? model<CaptainDoc>("Captain", captainSchema);