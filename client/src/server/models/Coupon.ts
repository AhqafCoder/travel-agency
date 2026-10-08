import mongoose, { model, Schema, Types, type Model, type InferSchemaType } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    value: { type: Number, required: true, min: 0 }, // % or fixed INR
    minimumAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number }, // cap for percentage coupons
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    active: { type: Boolean, default: true },
    // Admin-controlled: when true the code is suggested publicly on the booking page.
    promoted: { type: Boolean, default: false },
    applicableTripIds: [{ type: Schema.Types.ObjectId, ref: "Trip" }], // empty = all
  },
  { timestamps: true }
);

couponSchema.index({ active: 1, validFrom: 1, validUntil: 1 });

export type CouponDoc = InferSchemaType<typeof couponSchema> & {
  _id: Types.ObjectId;
};

export const Coupon: Model<CouponDoc> =
  (mongoose.models.Coupon as Model<CouponDoc>) ?? model<CouponDoc>("Coupon", couponSchema);