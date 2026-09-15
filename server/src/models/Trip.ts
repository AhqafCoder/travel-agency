import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { TRIP_DIFFICULTIES, TRIP_TYPES, TripStatus } from "./enums.js";

const itineraryDaySchema = new Schema(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    activities: [{ type: String }],
    meals: [{ type: String, enum: ["Breakfast", "Lunch", "Dinner"] }],
    stay: { type: String },
    transport: { type: String },
    distance: { type: String },
    highlights: [{ type: String }],
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    destinationId: { type: Schema.Types.ObjectId, ref: "Destination" },
    durationDays: { type: Number, required: true, min: 1 },
    durationNights: { type: Number, default: 0 },
    basePrice: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    tripType: { type: String, enum: TRIP_TYPES, required: true },
    difficulty: { type: String, enum: TRIP_DIFFICULTIES, required: true },
    minAge: { type: Number, default: 16 },
    maxGroupSize: { type: Number, default: 20 },
    status: { type: String, enum: Object.values(TripStatus), default: TripStatus.DRAFT },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    coverImage: { type: String, default: "" },
    gallery: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    faqs: [faqSchema],
    itinerary: [itineraryDaySchema],
    captainId: { type: Schema.Types.ObjectId, ref: "Captain" },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
);

tripSchema.index({ title: "text", shortDescription: "text", description: "text" });
tripSchema.index({ status: 1, featured: 1, trending: 1 });
tripSchema.index({ destinationId: 1 });

export type TripDoc = InferSchemaType<typeof tripSchema> & { _id: Types.ObjectId };

export const Trip = model<TripDoc>("Trip", tripSchema);