import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { ReviewStatus } from "./enums.js";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    content: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.PENDING,
    },
    verifiedBooking: { type: Boolean, default: false },
    adminNote: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ tripId: 1, status: 1 });
reviewSchema.index({ userId: 1 });

export type ReviewDoc = InferSchemaType<typeof reviewSchema> & {
  _id: Types.ObjectId;
};

export const Review = model<ReviewDoc>("Review", reviewSchema);