import type { Metadata } from "next";
import { LegalPage } from "@/components/support/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | EditMyTrips",
  description:
    "How EditMyTrips collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="We collect the minimum data needed to plan great trips — and we never sell it. Here's the full picture."
      lastUpdated="1 September 2026"
      sections={[
        {
          heading: "Information we collect",
          bullets: [
            "Account details: name, email, phone number and (optionally) profile photo.",
            "Booking details: traveller information (names, ages, ID type/number as required by law for permits), trip preferences and special requests.",
            "Payment data: processed by Razorpay; we store only the transaction reference, never card numbers or CVV.",
            "Usage data: pages visited, enquiries submitted and device/browser information, used to improve the site.",
          ],
        },
        {
          heading: "How we use your information",
          bullets: [
            "To operate your bookings: confirmations, departures updates, captain coordination and support.",
            "To personalise trip recommendations and itineraries.",
            "To send transactional updates (booking, payment, trip reminders) and — only with your consent — marketing emails you can unsubscribe from at any time.",
            "To meet legal obligations such as permit and border-area documentation requirements.",
          ],
        },
        {
          heading: "Who we share it with",
          paragraphs: [
            "We share the minimum necessary data with vendors who deliver your trip: stay partners, transport providers, activity operators and permit authorities. They receive only what's required for your booking (typically names, ages and ID details) and are bound by confidentiality obligations.",
          ],
          bullets: [
            "We never sell your personal data to third parties.",
            "We use Resend for email delivery and Razorpay for payments — both process data under strict DPAs.",
            "We may disclose data if required by law, regulation or valid legal process.",
          ],
        },
        {
          heading: "Data storage and security",
          paragraphs: [
            "Your data is stored on encrypted, access-controlled infrastructure. We apply industry-standard safeguards including TLS in transit, hashed credentials and role-based access inside our team. Payment card data is handled entirely by Razorpay's PCI-DSS compliant infrastructure.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can access, correct or delete your personal data at any time, or withdraw marketing consent, by writing to hello@editmytrips.com. We action verified requests within 30 days. Booking records needed for legal/financial compliance may be retained as required by law even after deletion requests.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "We use a small set of essential cookies to keep you signed in and remember your preferences, plus privacy-friendly analytics to understand which trips people love. No cross-site advertising trackers.",
          ],
        },
      ]}
    />
  );
}
