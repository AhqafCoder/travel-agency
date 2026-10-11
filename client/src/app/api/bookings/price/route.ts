import { Trip } from "@/server/models/Trip";
import { Departure } from "@/server/models/Departure";
import { ok, fail, body, handle, requireAuth } from "@/server/lib/http";
import { calculatePrice } from "@/server/services/pricing.service";
import { getUpcomingDepartures } from "@/server/services/public.service";

/** POST /api/bookings/price — auth'd coupon-aware price preview (no seats reserved). */
export const POST = handle(async (req) => {
  // Auth required: blocks unauthenticated coupon-code enumeration.
  await requireAuth(req);

  const { tripId, departureId, travellersCount, couponCode } = await body<{
    tripId?: string;
    departureId?: string;
    travellersCount?: number;
    couponCode?: string;
  }>(req);

  if (!tripId || !travellersCount || travellersCount < 1) {
    return fail("tripId and travellersCount (>0) are required", 400);
  }

  const trip = await Trip.findById(tripId).lean();
  if (!trip) return fail("Trip not found", 404);

  // Same price derivation as booking creation: departure price wins when set.
  let pricePerPerson = trip.discountedPrice ?? trip.basePrice;
  if (departureId) {
    const dep = await Departure.findById(departureId).select("price").lean();
    if (dep && Number(dep.price) > 0) pricePerPerson = Number(dep.price);
  }

  const price = await calculatePrice({ pricePerPerson, travellersCount, couponCode, tripId: String(trip._id) });
  const departures = await getUpcomingDepartures(tripId);

  return ok({ price, departures });
});
