import { model, Schema, Types, type InferSchemaType } from "mongoose";
import { PaymentMethod, PaymentStatus } from "./enums.js";

const paymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    provider: { type: String, enum: ["RAZORPAY", "MANUAL"], default: "MANUAL" },
    orderId: { type: String },
    transactionId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod) },
    razorpaySignature: { type: String },
    paidAt: { type: Date },
    refundedAt: { type: Date },
    refundAmount: { type: Number, min: 0 },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ orderId: 1 });

export type PaymentDoc = InferSchemaType<typeof paymentSchema> & {
  _id: Types.ObjectId;
};

export const Payment = model<PaymentDoc>("Payment", paymentSchema);