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
      <SidebarProvider>
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
