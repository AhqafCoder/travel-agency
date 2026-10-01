import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Log in to the editmytrips admin portal.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <AuthForm
          mode="login"
          title="Admin Portal"
          description="Log in with your administrator credentials to manage the platform."
          submitLabel="Access Portal"
        />
      </div>
    </div>
  );
}
