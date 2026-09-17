import type { Metadata } from "next";
import { AuthForm, AuthFooterLink } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join editmytrips — book handcrafted trips, track your journeys, and be part of India's travel community.",
};

export default function RegisterPage() {
  return (
    <AuthForm
      mode="register"
      title="Create your account"
      description="Join editmytrips and start planning your next adventure."
      submitLabel="Create account"
      footer={
        <AuthFooterLink
          prompt="Already have an account?"
          href="/login"
          label="Log in"
        />
      }
    />
  );
}