import { model, Schema, Types, type InferSchemaType } from "mongoose";

const destinationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: "India" },
    description: { type: String, required: true },
    heroImage: { type: String, default: "" },
    gallery: [{ type: String }],
    bestTime: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

destinationSchema.index({ name: "text", description: "text" });

export type DestinationDoc = InferSchemaType<typeof destinationSchema> & {
  _id: Types.ObjectId;
};

export const Destination = model<DestinationDoc>("Destination", destinationSchema);