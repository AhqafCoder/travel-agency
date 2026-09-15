import { Coupon } from "../models/Coupon.js";

export const TAX_RATE = 0.05; // 5% GST, configurable later

export interface PriceBreakdown {
  basePrice: number;
  subtotal: number;
  couponDiscount: number;
  tax: number;
  total: number;
  pricePerPerson: number;
  travellersCount: number;
}

export interface CouponResult {
  discount: number;
  couponCode?: string;
}

/**
 * Core price engine shared by booking creation and price-preview endpoints.
 *
 *   subtotal = pricePerPerson * travellersCount
 *   total    = subtotal - couponDiscount + tax
 *   tax      = 5% of (subtotal - couponDiscount)
 */
export async function calculatePrice(input: {
  pricePerPerson: number;
  travellersCount: number;
  couponCode?: string;
  tripId?: string;
}): Promise<PriceBreakdown> {
  const { pricePerPerson, travellersCount, couponCode, tripId } = input;

  const subtotal = pricePerPerson * travellersCount;
  let couponDiscount = 0;

  if (couponCode) {
    const result = await applyCoupon({ couponCode, subtotal, tripId });
    couponDiscount = result.discount;
  }

  const taxable = Math.max(subtotal - couponDiscount, 0);
  const tax = Math.round(taxable * TAX_RATE);
  const total = subtotal - couponDiscount + tax;

  return {
    basePrice: pricePerPerson,
    subtotal,
    couponDiscount,
    tax,
    total,
    pricePerPerson,
    travellersCount,
  };
}

/**
 * Validates a coupon against the DB and returns its discount.
 * Throws a user-facing error if the coupon is invalid/expired/inapplicable.
 */
export async function applyCoupon(input: {
  couponCode: string;
  subtotal: number;
  tripId?: string;
}): Promise<CouponResult> {
  const { couponCode, subtotal, tripId } = input;

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) {
    throw new Error("Invalid coupon code");
  }
  if (!coupon.active) {
    throw new Error("Coupon is no longer active");
  }
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new Error("Coupon is outside its validity period");
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }
  if (subtotal < coupon.minimumAmount) {
    throw new Error(
      `Coupon requires a minimum order value of ₹${coupon.minimumAmount}`
    );
  }
  if (
    coupon.applicableTripIds.length > 0 &&
    (!tripId ||
      !coupon.applicableTripIds.some((id) => id.toString() === tripId))
  ) {
    throw new Error("Coupon not applicable to this trip");
  }

  let discount =
    coupon.type === "PERCENTAGE"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
    discount = coupon.maximumDiscount;
  }

  return { discount, couponCode: coupon.code };
}