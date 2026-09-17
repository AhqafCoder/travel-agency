import type { Metadata } from "next";
import { AuthForm, AuthFooterLink } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your editmytrips account and pick up where you left off.",
};

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      title="Welcome back"
      description="Log in to manage your bookings and plan your next adventure."
      submitLabel="Log in"
      footer={
        <AuthFooterLink
          prompt="New to editmytrips?"
          href="/register"
          label="Create an account"
        />
      }
    />
  );
}