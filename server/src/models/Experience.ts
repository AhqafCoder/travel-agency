import { model, Schema, Types, type InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destinationId: { type: Schema.Types.ObjectId, ref: "Destination" },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // "3 hours"
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, default: 10 },
    hostId: { type: Schema.Types.ObjectId, ref: "User" },
    images: [{ type: String }],
    category: { type: String, required: true },
    highlights: [{ type: String }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ title: "text", description: "text" });
experienceSchema.index({ destinationId: 1, status: 1, category: 1 });

export type ExperienceDoc = InferSchemaType<typeof experienceSchema> & {
  _id: Types.ObjectId;
};

export const Experience = model<ExperienceDoc>("Experience", experienceSchema);