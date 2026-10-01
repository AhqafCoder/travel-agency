"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ALLOWED_ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "EDITOR"];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const isLoading = status === "loading";
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    if (!user) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!ALLOWED_ADMIN_ROLES.includes(user.role)) {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoading, router, pathname]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return <>{children}</>;
}
