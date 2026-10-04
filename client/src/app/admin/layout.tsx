"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <AdminGuard>
        {children}
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#111] flex flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader title="Admin Dashboard" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#111] p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
