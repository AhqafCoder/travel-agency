"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111] sticky top-0 z-20">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {actions}

        {/* Notifications */}
        <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors outline-none cursor-pointer">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs bg-orange-500/20 text-orange-400">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f172a] border-white/10 text-slate-200">
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300"
                onClick={() => { logout(); router.push("/"); }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
