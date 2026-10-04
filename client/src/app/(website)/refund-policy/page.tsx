import type { Metadata } from "next";
import { LegalPage } from "@/components/support/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy | EditMyTrips",
  description:
    "How and when EditMyTrips issues refunds for cancelled bookings, failed payments and unavailed services.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      description="Everything about how refunds are calculated, processed and credited back to you."
      lastUpdated="1 September 2026"
      sections={[
        {
          heading: "Eligibility for refunds",
          paragraphs: [
            "Refunds are governed by our Cancellation Policy slabs. In summary: you are eligible for a refund whenever you cancel more than 7 days before departure, when EditMyTrips cancels or materially alters a departure, or when a service you paid for cannot be delivered.",
          ],
        },
        {
          heading: "Failed or duplicate payments",
          paragraphs: [
            "If money was debited but your booking didn't confirm, or you were charged twice, let us know with your payment reference. Failed transaction amounts are auto-reversed by your bank within 5–7 business days; if you don't see the reversal, we'll raise a trace with our payment gateway on your behalf. Duplicate payments confirmed by our team are refunded in full within 7 business days.",
          ],
        },
        {
          heading: "How refunds are calculated",
          bullets: [
            "Refunds are always computed on the amount actually paid for the cancelled traveller or service.",
            "Booking amounts and add-ons are refunded per the cancellation slab that applies on the date of request.",
            "Non-refundable components (permits, park fees, air tickets) are refunded only to the extent our vendors refund them to us.",
            "Discounts and promo codes are reapplied proportionally; if the code required a minimum booking value, the discount is reversed when the refund drops below it.",
          ],
        },
        {
          heading: "Refund method and timeline",
          paragraphs: [
            "All refunds go back to the original payment method used at booking — UPI to the same UPI ID, cards to the same card, and so on. Once approved, refunds are initiated within 7–10 business days. Your bank or card network may take an additional 5–7 days to post the credit.",
          ],
          bullets: [
            "Trip credits (if you opted for them) are issued instantly and valid for 12 months.",
            "Cash refunds are not issued for bookings made with trip credits.",
          ],
        },
        {
          heading: "How to request a refund",
          paragraphs: [
            "Write to us with your booking reference and reason for cancellation, or message us on WhatsApp. Our support team acknowledges every request within 24 hours and completes the assessment within 3 business days. You'll receive email updates at every step.",
          ],
        },
      ]}
    />
  );
}
