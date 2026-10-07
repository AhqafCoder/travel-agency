"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Scope the light theme to the admin section (incl. portals).
  React.useEffect(() => {
    document.body.classList.add("admin-light");
    return () => document.body.classList.remove("admin-light");
  }, []);

  if (isLoginPage) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <SidebarProvider
        style={{
          // Light sidebar kept on-brand: soft gray surface, orange active states
          "--sidebar": "#f7f7f8",
          "--sidebar-foreground": "#3f3f46",
          "--sidebar-accent": "rgba(255, 107, 53, 0.10)",
          "--sidebar-accent-foreground": "#e85a25",
          "--sidebar-border": "#ececee",
          "--sidebar-primary": "#FF6B35",
          "--sidebar-ring": "#FF6B35",
        } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden p-4 md:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
