import type { Metadata } from "next";
import { LegalPage } from "@/components/support/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | EditMyTrips",
  description:
    "The terms that govern your use of EditMyTrips and participation in our trips.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The agreement between you and EditMyTrips when you browse, book or travel with us."
      lastUpdated="1 September 2026"
      sections={[
        {
          heading: "Using our platform",
          paragraphs: [
            "By accessing EditMyTrips or booking a trip, you agree to these terms. You confirm that the information you provide is accurate, that you're at least 18 years old to make a booking, and that you'll keep your account credentials secure.",
          ],
        },
        {
          heading: "Bookings, prices and payment",
          bullets: [
            "A booking is confirmed only after we receive the applicable booking amount and send a written confirmation.",
            "Prices are quoted in INR and include only the items listed on the trip page. Prices may change until your booking is confirmed; confirmed bookings keep their quoted price.",
            "The balance payment is due 15 days before departure; we may release unclaimed seats after the due date.",
            "Any personal expenses, travel to the meeting point, visa/permit fees not listed, and insurance are not included unless explicitly stated.",
          ],
        },
        {
          heading: "Traveller responsibilities",
          bullets: [
            "Carry valid government-issued photo ID and any permits we flag as mandatory for your destination.",
            "Inform us of medical conditions, dietary needs or accessibility requirements before booking so we can advise honestly on suitability.",
            "Follow the trip captain's safety instructions at all times. We may remove a traveller from activities (without refund) whose conduct endangers the group.",
            "Respect local communities, wildlife and the environment — leave places better than you found them.",
          ],
        },
        {
          heading: "Itineraries and changes",
          paragraphs: [
            "Mountains, weather and roads have their own plans. We may adjust itineraries for safety or operational reasons — substitute stays, reroute days or shorten activities — while preserving the overall substance of the trip. Significant changes are communicated as early as possible and never reduce your trip's value without compensation options.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "We take safety seriously — vetted captains, certified operators and tested routes — but adventure travel involves inherent risks beyond our control (weather, terrain, third-party services). Our liability for any claim is limited to the amount you paid us for the booking, except where the law provides otherwise. We strongly recommend travel insurance.",
          ],
        },
        {
          heading: "Cancellations and refunds",
          paragraphs: [
            "Cancellation and refund terms are detailed in our Cancellation Policy and Refund Policy, which form part of these terms.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of India, and the courts of Mumbai, Maharashtra have exclusive jurisdiction over any disputes.",
          ],
        },
      ]}
    />
  );
}
