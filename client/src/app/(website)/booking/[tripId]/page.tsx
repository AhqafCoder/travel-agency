import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_TRIPS } from "@/lib/mock-data";
import { BookingFlow } from "@/components/booking/BookingFlow";

type BookingParams = {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ departure?: string; count?: string }>;
};

export async function generateMetadata({ params }: BookingParams): Promise<Metadata> {
  const { tripId } = await params;
  const trip = MOCK_TRIPS.find((t) => t._id === tripId);
  if (!trip) return { title: "Booking Not Found" };
  return {
    title: `Book ${trip.title} | editmytrips`,
    description: `Reserve your spot on ${trip.title}. Simple 3-step booking with instant confirmation.`,
  };
}

export default async function BookingPage({ params, searchParams }: BookingParams) {
  const { tripId } = await params;
  const { departure, count } = await searchParams;

  const trip = MOCK_TRIPS.find((t) => t._id === tripId);
  if (!trip) notFound();

  const presetCount = count ? Math.max(1, Math.min(12, Number(count) || 1)) : undefined;

  return (
    <BookingFlow
      trip={trip}
      presetDepartureId={departure}
      presetCount={presetCount}
    />
  );
}