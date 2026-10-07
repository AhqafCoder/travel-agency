import { formatPrice } from "@/lib/utils";

interface PriceBreakdownProps {
  pricePerPerson: number;
  travellersCount: number;
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  tax: number;
  total: number;
}

export function PriceBreakdown({
  pricePerPerson,
  travellersCount,
  subtotal,
  discount = 0,
  couponCode,
  tax,
  total,
}: PriceBreakdownProps) {
  const calculatedSubtotal = subtotal ?? pricePerPerson * travellersCount;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-3">
        Price Breakdown
      </h3>

      <div className="space-y-2 text-sm">
        {/* Base */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {formatPrice(pricePerPerson)} × {travellersCount} person
            {travellersCount > 1 ? "s" : ""}
          </span>
          <span className="font-medium text-foreground">
            {formatPrice(pricePerPerson * travellersCount)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span className="flex items-center gap-1.5">
              Discount
              {couponCode && (
                <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                  {couponCode}
                </span>
              )}
            </span>
            <span className="font-medium">−{formatPrice(discount)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/6" />

        {/* Subtotal */}
        <div className="flex justify-between font-medium">
          <span className="text-foreground/70">Subtotal</span>
          <span className="text-foreground">
            {formatPrice(calculatedSubtotal - discount)}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between text-muted-foreground">
          <span>GST (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6" />

        {/* Total */}
        <div className="flex justify-between text-base font-bold">
          <span className="text-foreground">Total Payable</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-1">
        Inclusive of all taxes. No hidden charges.
      </p>
    </div>
  );
}
