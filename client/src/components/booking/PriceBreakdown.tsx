import { formatPrice } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";

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
  total 
}: PriceBreakdownProps) {
  const calculatedSubtotal = subtotal ?? pricePerPerson * travellersCount;
  const calculatedTotal = total ?? calculatedSubtotal - discount + tax;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        Price Breakdown
      </h3>

      <div className="space-y-2 text-sm">
        {/* Base price */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Trip price × {travellersCount}
          </span>
          <span className="font-medium">{formatPrice(pricePerPerson * travellersCount)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-teal">
            <span className="flex items-center gap-1">
              Discount
              {couponCode && (
                <span className="text-xs bg-teal-muted text-teal px-1.5 py-0.5 rounded">
                  {couponCode}
                </span>
              )}
            </span>
            <span className="font-medium">−{formatPrice(discount)}</span>
          </div>
        )}

        <Separator className="my-1" />

        {/* Subtotal */}
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(calculatedSubtotal - discount)}</span>
        </div>

        {/* GST */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>GST (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <Separator className="my-1" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-foreground">
          <span>Total Payable</span>
          <span>{formatPrice(calculatedTotal)}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Inclusive of all taxes. No hidden charges.
      </p>
    </div>
  );
}