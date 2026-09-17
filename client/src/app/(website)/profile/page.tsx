import type { Metadata } from "next";
import { ProfileShell } from "@/components/profile/ProfileShell";

export const metadata: Metadata = {
  title: "My Profile | editmytrips",
  description:
    "Your bookings, upcoming trips, and account details with editmytrips.",
};

export default function ProfilePage() {
  return <ProfileShell />;
}