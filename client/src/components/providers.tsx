"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthContext";
import { FloatingEnquiryWidget } from "@/components/common/FloatingEnquiryWidget";
import { AuthModal } from "@/components/auth/LoginModal";
import { ReviewPrompt } from "@/components/reviews/ReviewPrompt";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  // Floating customer widgets (enquiry pop-up, post-trip review prompt)
  // belong to the public website only — never the admin panel or checkout.
  const isAppRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/booking") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register");
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
        {!isAppRoute && <FloatingEnquiryWidget />}
        {!isAppRoute && <ReviewPrompt />}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultMode={authMode} />
      </AuthProvider>
      <Toaster
        position="top-right"
        theme={theme}
        richColors
        expand
        toastOptions={{
          style: { fontFamily: "var(--font-geist-sans)" },
        }}
      />
    </QueryClientProvider>
  );
}
