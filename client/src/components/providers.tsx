"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthContext";
import { FloatingEnquiryWidget } from "@/components/common/FloatingEnquiryWidget";
import { AuthModal } from "@/components/auth/LoginModal";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const handleOpenLogin = () => {
      setAuthMode("login");
      setIsAuthModalOpen(true);
    };
    const handleOpenRegister = () => {
      setAuthMode("register");
      setIsAuthModalOpen(true);
    };
    window.addEventListener("open-login-modal", handleOpenLogin);
    window.addEventListener("open-register-modal", handleOpenRegister);
    return () => {
      window.removeEventListener("open-login-modal", handleOpenLogin);
      window.removeEventListener("open-register-modal", handleOpenRegister);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <FloatingEnquiryWidget />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode={authMode} />
      </AuthProvider>
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: { fontFamily: "var(--font-geist-sans)" },
        }}
      />
    </QueryClientProvider>
  );
}
