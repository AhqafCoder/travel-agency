"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_SECTIONS,
  type AdminNavItem,
} from "./admin-nav";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Brand ─────────────────────────────────────── */}
      <SidebarHeader className="px-2 pb-1 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin" />}
              className="data-active:bg-transparent"
            >
              <div className="flex aspect-square size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(16,24,40,0.12)] ring-1 ring-black/[0.06]">
                <Image
                  src="/favicon.png"
                  alt="EditMyTrips"
                  width={26}
                  height={26}
                  className="size-[26px] object-contain"
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="font-display truncate text-[15px] font-bold tracking-tight text-foreground">
                  editmytrips
                </span>
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  Admin Console
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ────────────────────────────────── */}
      <SidebarContent className="gap-0.5 px-2 py-1">
        {ADMIN_NAV_ITEMS.filter((i) => !i.section).map((item) => (
          <SidebarGroup key={item.href} className="p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItemButton item={item} active={isActive(item.href)} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {ADMIN_NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section} className="py-1.5">
            <SidebarGroupLabel className="px-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-zinc-400">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {ADMIN_NAV_ITEMS.filter((i) => i.section === section).map(
                  (item) => (
                    <NavItemButton
                      key={item.href}
                      item={item}
                      active={isActive(item.href)}
                    />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── User ──────────────────────────────────────── */}
      <SidebarFooter className="p-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-auto rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:bg-zinc-50 data-[popup-open]:bg-zinc-50 data-[popup-open]:text-foreground"
                  />
                }
              >
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-xs font-bold text-[#e85a25]">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {user?.name || "Admin"}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-xl border-black/[0.06]"
                side="top"
                align="end"
                sideOffset={6}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-xs font-bold text-[#e85a25]">
                        {user?.name?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-[13px] font-semibold">
                        {user?.name || "Admin"}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/")}
                  className="gap-2 rounded-lg"
                >
                  <ExternalLink className="size-4 text-zinc-400" />
                  View Website
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 rounded-lg text-red-600 focus:text-red-600"
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function NavItemButton({
  item,
  active,
}: {
  item: AdminNavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={item.label}
        render={<Link href={item.href} />}
        className={cn(
          "h-9 rounded-lg px-2.5 text-[13.5px] transition-all",
          "hover:bg-zinc-100/80 hover:text-foreground",
          "data-active:bg-orange-500/[0.12] data-active:font-semibold data-active:text-[#e85a25]",
          "active:scale-[0.98]"
        )}
      >
        <Icon
          className={cn(
            "size-[18px] shrink-0",
            active ? "text-[#e85a25]" : "text-zinc-500"
          )}
        />
        <span className="truncate">{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
