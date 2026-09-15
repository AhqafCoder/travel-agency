import { BookingTraveller, Trip, TripDeparture } from "@/types";
import { formatPrice } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";

interface BookingSummaryProps {
  trip: Trip;
  departure: TripDeparture;
  travellers: BookingTraveller[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
}

export function BookingSummary({
  trip,
  departure,
  travellers,
  subtotal,
  discount,
  couponCode,
  tax,
  total,
}: BookingSummaryProps) {
  return (
    <div className="bg-background border border-border/20 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Booking Summary</h3>

      {/* Trip Info */}
      <div className="flex items-start gap-4 mb-6 p-4 rounded-lg bg-muted/30">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{trip.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(departure.startDate).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {departure.meetingPoint} &bull; {departure.meetingTime}
          </p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Travellers */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Travellers ({travellers.length})
        </h4>
        <div className="space-y-2">
          {travellers.map((traveller, idx) => (
            <div key={traveller._id} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {idx + 1}. {traveller.fullName}
                </span>
                <span className="text-muted-foreground">
                  {traveller.age} yrs &bull; {traveller.gender}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {traveller.phone} &bull; {traveller.email}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Price */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Trip price &times; {travellers.length}</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-teal">
            <span>
              Discount
              {couponCode && (
                <span className="ml-1 text-xs bg-teal-muted text-teal px-1.5 py-0.5 rounded">
                  {couponCode}
                </span>
              )}
            </span>
            <span className="font-medium">&minus;{formatPrice(discount)}</span>
          </div>
        )}
        <Separator className="my-1" />
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal - discount)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>GST (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between text-lg font-bold text-foreground">
          <span>Total Payable</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}