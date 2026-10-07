import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTripBySlugOrId } from "@/server/services/public.service";
import { BookingFlow } from "@/components/booking/BookingFlow";

// Live DB data (seats, prices, views) — always render fresh.
export const dynamic = "force-dynamic";

type BookingParams = {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ departure?: string; count?: string }>;
};

export async function generateMetadata({ params }: BookingParams): Promise<Metadata> {
  const { tripId } = await params;
  const trip = await getTripBySlugOrId(tripId);
  if (!trip) return { title: "Booking Not Found" };
  return {
    title: `Book ${trip.title} | editmytrips`,
    description: `Reserve your spot on ${trip.title}. Simple 3-step booking with instant confirmation.`,
  };
}

export default async function BookingPage({ params, searchParams }: BookingParams) {
  const { tripId } = await params;
  const { departure, count } = await searchParams;

  const trip = await getTripBySlugOrId(tripId);
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