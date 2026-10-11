"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminPageTitle } from "./admin-nav";

interface AdminHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageTitle = title ?? getAdminPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-black/[0.06] bg-white/85 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1 rounded-lg hover:bg-zinc-100" />

      {/* Breadcrumb + title */}
      <div className="ml-1.5 flex min-w-0 items-baseline gap-2.5">
        <span className="hidden text-[13px] font-medium text-zinc-400 sm:inline">
          Admin
        </span>
        <ChevronRight className="hidden size-3.5 self-center text-zinc-300 sm:inline" />
        <div className="min-w-0">
          <h1 className="font-display truncate text-[17px] font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h1>
          {description && (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {actions}
        <Link
          href="/"
          className="hidden items-center gap-1.5 rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-xs font-medium text-zinc-600 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-zinc-50 hover:text-foreground sm:flex"
        >
          <ExternalLink className="size-3.5 text-zinc-400" />
          View Website
        </Link>
        <Link
          href="/admin/notifications"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.06] bg-white text-zinc-500 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:bg-zinc-50 hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FF6B35] ring-2 ring-white" />
        </Link>
      </div>
    </header>
  );
}
