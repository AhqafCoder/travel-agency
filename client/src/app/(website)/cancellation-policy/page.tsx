import type { Metadata } from "next";
import { LegalPage } from "@/components/support/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation Policy | EditMyTrips",
  description:
    "Understand EditMyTrips' cancellation terms, refund timelines and date-change options.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      description="Plans change — we get it. Here's exactly what happens when you need to cancel or reschedule your trip."
      lastUpdated="1 September 2026"
      sections={[
        {
          heading: "Cancellation by you",
          paragraphs: [
            "Cancellation charges are calculated from the date we receive your written cancellation request (email or WhatsApp). The following slabs apply per traveller:",
          ],
          bullets: [
            "30 or more days before departure: 90% refund of the total trip cost.",
            "15–29 days before departure: 50% refund of the total trip cost.",
            "7–14 days before departure: 25% refund of the total trip cost.",
            "Less than 7 days before departure, or a no-show: no refund.",
          ],
        },
        {
          heading: "Cancellation by EditMyTrips",
          paragraphs: [
            "We rarely cancel departures, but extreme weather, natural events or government restrictions can force our hand. If we cancel a trip you get a choice of:",
          ],
          bullets: [
            "A 100% refund of every rupee you've paid, or",
            "A free transfer to any other departure of the same trip (subject to availability), or",
            "Full credit that stays valid for 12 months across any of our trips.",
          ],
        },
        {
          heading: "Date changes",
          paragraphs: [
            "You may transfer your booking to a different departure of the same trip once, free of charge, if requested at least 21 days before departure. Later changes carry a 10% rescheduling fee plus any difference in trip price. Within 7 days of departure, changes are treated as cancellations.",
          ],
        },
        {
          heading: "Refund timelines",
          paragraphs: [
            "Approved refunds are processed to your original payment method within 7–10 business days. Bank or card networks may take an additional 5–7 days to reflect the amount. Promo codes and trip credits used at booking are refunded as credits, not cash.",
          ],
        },
        {
          heading: "Force majeure & travel advisories",
          paragraphs: [
            "If a trip is disrupted by circumstances beyond anyone's control (weather closures, political unrest, pandemics), we will first attempt to reroute or reschedule your itinerary at no extra cost. Where that isn't possible, our standard cancellation slabs apply to the unconsumed portion of the trip.",
          ],
        },
      ]}
    />
  );
}
