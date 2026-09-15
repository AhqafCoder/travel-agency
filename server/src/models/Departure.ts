import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { DepartureStatus } from "./enums.js";

const departureSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    meetingPoint: { type: String },
    meetingTime: { type: String },
    status: {
      type: String,
      enum: Object.values(DepartureStatus),
      default: DepartureStatus.DRAFT,
    },
    captainId: { type: Schema.Types.ObjectId, ref: "Captain" },
    notes: { type: String },
  },
  { timestamps: true }
);

departureSchema.index({ tripId: 1, startDate: 1 });
departureSchema.index({ status: 1 });

export type DepartureDoc = InferSchemaType<typeof departureSchema> & {
  _id: Types.ObjectId;
};

export const Departure = model<DepartureDoc>("Departure", departureSchema);

/** Atomically reserve seats — the core anti-double-booking guard. */
export async function reserveSeats(
  departureId: string,
  seats: number
): Promise<DepartureDoc | null> {
  return Departure.findOneAndUpdate(
    {
      _id: departureId,
      availableSeats: { $gte: seats },
      status: { $in: [DepartureStatus.ACTIVE, DepartureStatus.DRAFT] },
    },
    { $inc: { availableSeats: -seats, bookedSeats: seats } },
    { new: true }
  );
}