import { Booking } from "../models/Booking";
import { Departure, reserveSeats } from "../models/Departure";
import { Trip } from "../models/Trip";
import { calculatePrice } from "./pricing.service";
import { Coupon } from "../models/Coupon";
import { BookingStatus, PaymentStatus } from "../models/enums";

function generateBookingNumber(): string {
  const seq = Math.floor(10000 + Math.random() * 90000);
  return `EMT${seq}`;
}

export interface CreateBookingInput {
  userId: string;
  tripId: string;
  departureId: string;
  travellers: {
    fullName: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    phone: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    specialRequirements?: string;
    idType?: string;
    idNumber?: string;
  }[];
  couponCode?: string;
  notes?: string;
}

/**
 * Creates a booking with atomic seat reservation.
 *
 * Order of operations (prevents double-booking races):
 *  1. Load trip → derive price per person.
 *  2. Atomically $inc availableSeats via findOneAndUpdate.
 *  3. Compute price (coupon-aware).
 *  4. Persist booking.
 *
 * A future upgrade wraps 2–4 in a Mongo session transaction.
 */
export async function createBooking(input: CreateBookingInput) {
  const { userId, tripId, departureId, travellers, couponCode, notes } = input;

  const trip = await Trip.findById(tripId);
  if (!trip) {
    const err = new Error("Trip not found") as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const travellersCount = travellers.length;

  // Departure-specific price wins when the admin set one; otherwise trip price.
  const departureDoc = await Departure.findById(departureId).select("price");
  if (!departureDoc) {
    const err = new Error("Departure not found") as Error & { status: number };
    err.status = 404;
    throw err;
  }
  const pricePerPerson = departureDoc.price > 0 ? departureDoc.price : trip.discountedPrice ?? trip.basePrice;

  // Validate the coupon and compute the full price BEFORE reserving seats —
  // otherwise a failed coupon leaves reserved seats stranded with no booking.
  const price = await calculatePrice({ pricePerPerson, travellersCount, couponCode, tripId: String(trip._id) });

  // Atomic seat reservation — ACTIVE departures only, fails if not enough seats.
  const reserved = await reserveSeats(departureId, travellersCount);
  if (!reserved) {
    const err = new Error(
      "Not enough seats available on this departure"
    ) as Error & { status: number };
    err.status = 409;
    throw err;
  }

  let booking;
  try {
    booking = await Booking.create({
    bookingNumber: generateBookingNumber(),
    userId,
    tripId,
    departureId,
    travellers,
    travellersCount,
    subtotal: price.subtotal,
    discount: price.couponDiscount,
    couponCode,
    tax: price.tax,
    total: price.total,
    paymentStatus: PaymentStatus.PENDING,
    bookingStatus: BookingStatus.PENDING,
      notes,
    });
    // Count coupon usage so usageLimit is honoured over time.
    if (couponCode && price.couponDiscount > 0) {
      await Coupon.updateOne({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
    }
  } catch (err) {
    // Persistence failed after seats were taken — give them back.
    await Departure.findByIdAndUpdate(departureId, {
      $inc: { availableSeats: travellersCount, bookedSeats: -travellersCount },
    });
    throw err;
  }

  return booking.populate("tripId departureId");
}

export async function cancelBooking(
  bookingId: string,
  reason: string,
  opts?: { userId?: string }
) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const err = new Error("Booking not found") as Error & { status: number };
    err.status = 404;
    throw err;
  }
  // Customers may only cancel their own bookings (staff passes no userId).
  if (opts?.userId && String(booking.userId) !== opts.userId) {
    const err = new Error("Booking not found") as Error & { status: number };
    err.status = 404;
    throw err;
  }
  if (booking.bookingStatus === BookingStatus.COMPLETED) {
    const err = new Error("Completed bookings cannot be cancelled") as Error & { status: number };
    err.status = 400;
    throw err;
  }
  // Already cancelled — don't release seats twice.
  if (booking.bookingStatus === BookingStatus.CANCELLED) {
    const err = new Error("Booking is already cancelled") as Error & { status: number };
    err.status = 400;
    throw err;
  }

  // Release the reserved seats back.
  await Departure.findByIdAndUpdate(booking.departureId, {
    $inc: {
      availableSeats: booking.travellersCount,
      bookedSeats: -booking.travellersCount,
    },
  });

  // Give the coupon budget back so it isn't permanently consumed.
  if (booking.couponCode && booking.discount > 0) {
    await Coupon.updateOne({ code: booking.couponCode.toUpperCase() }, { $inc: { usedCount: -1 } });
  }

  booking.bookingStatus = BookingStatus.CANCELLED;
  booking.cancelReason = reason;
  return booking.save();
}