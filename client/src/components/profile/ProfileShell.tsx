"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  Star,
  LogOut,
  Loader2,
  XCircle,
  PenLine,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

function statusColor(status: BookingStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function SignInPrompt() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center text-center py-12 px-6">
          <div className="w-16 h-16 rounded-full bg-brand-muted text-brand flex items-center justify-center mb-5">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Log in to see your profile
          </h2>
          <p className="text-muted-foreground mb-6">
            Your bookings, upcoming trips, and account details live here once
            you&apos;re signed in.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.dispatchEvent(new CustomEvent("open-login-modal"))}>
              Log in
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BookingCard({
  booking,
  past,
  onCancel,
  cancelling,
  onWriteReview,
}: {
  booking: Booking;
  past?: boolean;
  onCancel?: (booking: Booking) => void;
  cancelling?: boolean;
  onWriteReview?: (booking: Booking) => void;
}) {
  if (past) {
    return (
      <Card className="overflow-hidden border-border/30">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-40 h-32 sm:h-auto shrink-0">
            <Image
              src={booking.trip?.coverImage ?? ""}
              alt={booking.trip?.title ?? "Trip"}
              fill
              sizes="160px"
              className="object-cover opacity-80"
            />
          </div>
          <CardContent className="flex-1 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-foreground">
                {booking.trip?.title}
              </h3>
              <Badge className={statusColor(booking.bookingStatus)}>
                {booking.bookingStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            {onWriteReview && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => onWriteReview(booking)}
              >
                <PenLine className="w-3.5 h-3.5 mr-1" />
                Write a review
              </Button>
            )}
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow border-border/30">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={booking.trip?.coverImage ?? ""}
          alt={booking.trip?.title ?? "Trip"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">
            {booking.trip?.title}
          </h3>
          <Badge className={statusColor(booking.bookingStatus)}>
            {booking.bookingStatus}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {booking.departure
              ? new Date(booking.departure.startDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short", year: "numeric" }
                )
              : "Date TBC"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal" />
            {booking.travellersCount} traveller
            {booking.travellersCount > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal" />
            {booking.trip?.destination?.name ?? "India"}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border/20 pt-3">
          <div>
            <span className="text-sm text-muted-foreground">Booking </span>
            <span className="font-semibold text-foreground">
              {booking.bookingNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onCancel && booking.bookingStatus !== "CANCELLED" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-red-600"
                disabled={cancelling}
                onClick={() => onCancel(booking)}
              >
                {cancelling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                )}
                Cancel
              </Button>
            )}
            <Link
              href={`/trips/${booking.trip?.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileShell() {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Live bookings for the signed-in traveller.
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.bookings.list(),
    enabled: status === "authenticated",
  });

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancelBooking = async (booking: Booking) => {
    const reason = window.prompt(
      "Sorry to see you go — mind telling us why? (required)",
      "Change of plans"
    );
    if (reason === null) return; // cancelled
    if (!reason.trim()) {
      toast.error("A cancellation reason is required.");
      return;
    }
    setCancellingId(booking._id);
    try {
      await api.bookings.cancel(booking._id, reason.trim());
      toast.success(`Booking ${booking.bookingNumber} cancelled. Seats released.`);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not cancel the booking.");
    } finally {
      setCancellingId(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your profile…
      </div>
    );
  }

  if (!user) {
    return <SignInPrompt />;
  }

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your bookings…
      </div>
    );
  }

  const upcoming = bookings.filter(
    (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING"
  );
  const past = bookings.filter((b) => b.bookingStatus === "COMPLETED");
  // Money actually spent = paid bookings only (pending payment doesn't count).
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + b.total, 0);

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page header */}
      <section className="bg-muted/30 border-b border-border/20 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {user.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-brand-muted text-brand hover:bg-brand-muted">
                  Explorer
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {bookings.length} trips booked
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/explore">Plan next trip</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: Calendar,
              label: "Upcoming trips",
              value: String(upcoming.length),
            },
            {
              icon: CheckCircle2,
              label: "Trips completed",
              value: String(past.length),
            },
            { icon: Wallet, label: "Total spent", value: formatPrice(totalSpent) },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-11 h-11 rounded-xl bg-brand-muted text-brand flex items-center justify-center">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming bookings */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Trips
            </h2>
          </div>

          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No upcoming trips yet — the mountains are calling.
                </p>
                <Button asChild>
                  <Link href="/explore">
                    Explore trips <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={cancelBooking}
                  cancelling={cancellingId === booking._id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past trips */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-teal" />
              Past Trips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {past.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  past
                  onWriteReview={setReviewBooking}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <ReviewDialog
        booking={reviewBooking}
        open={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        onSubmitted={() => {
          toast.success("Thanks for sharing! Your review will appear after moderation.");
          queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
        }}
      />
    </div>
  );
}