import { Trip } from "@/server/models/Trip";
import { ok, fail, body, handle } from "@/server/lib/http";
import { calculatePrice } from "@/server/services/pricing.service";
import { getUpcomingDepartures } from "@/server/services/public.service";

/** POST /api/bookings/price — preview price (coupon-aware) without reserving seats. */
export const POST = handle(async (req) => {
  const { tripId, travellersCount, couponCode } = await body<{
    tripId?: string;
    travellersCount?: number;
    couponCode?: string;
  }>(req);

  if (!tripId || !travellersCount || travellersCount < 1) {
    return fail("tripId and travellersCount (>0) are required", 400);
  }

  const trip = await Trip.findById(tripId).lean();
  if (!trip) return fail("Trip not found", 404);

  const pricePerPerson = trip.discountedPrice ?? trip.basePrice;
  const price = await calculatePrice({ pricePerPerson, travellersCount, couponCode, tripId: String(trip._id) });
  const departures = await getUpcomingDepartures(tripId);

  return ok({ price, departures });
});
