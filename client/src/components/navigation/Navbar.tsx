"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, MapPin, LogOut, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useAuth } from "@/components/auth/AuthContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = status === "authenticated";

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "font-bold text-lg tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-foreground"
              )}
            >
              {SITE.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / Account */}
          <div className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="max-w-[110px] truncate text-sm font-medium">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link href="/profile">My Profile & Bookings</Link>}
                  />
                  <DropdownMenuItem
                    render={<Link href="/trips">Book a Trip</Link>}
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
            {!isAuthenticated && status !== "loading" && (
              <Button variant="outline" size="sm" asChild className="hidden lg:inline-flex">
                <Link href="/trips">Book a Trip</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                {/* Sheet Header */}
                <div className="flex items-center gap-2 px-6 py-5 border-b">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg">{SITE.name}</span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        pathname === link.href ||
                          pathname.startsWith(link.href + "/")
                          ? "text-primary bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Sheet Footer */}
                <div className="px-4 py-4 border-t space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/profile" onClick={() => setOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          My Profile & Bookings
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600"
                        onClick={() => {
                          setOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Log in
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register" onClick={() => setOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button className="w-full" asChild>
                    <Link href="/trips" onClick={() => setOpen(false)}>
                      Book a Trip
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}