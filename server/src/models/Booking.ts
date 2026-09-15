import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { BookingStatus, PaymentStatus } from "./enums.js";

const travellerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true, min: 1 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true },
    email: { type: String },
    emergencyContact: { type: String },
    emergencyPhone: { type: String },
    specialRequirements: { type: String },
    idType: {
      type: String,
      enum: ["AADHAAR", "PASSPORT", "PAN", "DRIVING_LICENSE"],
    },
    idNumber: { type: String },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    departureId: { type: Schema.Types.ObjectId, ref: "Departure", required: true },
    travellers: { type: [travellerSchema], default: [] },
    travellersCount: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    notes: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ tripId: 1, departureId: 1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

export type BookingDoc = InferSchemaType<typeof bookingSchema> & {
  _id: Types.ObjectId;
};

export const Booking = model<BookingDoc>("Booking", bookingSchema);