"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useAuth } from "@/components/auth/AuthContext";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/* ── Mega-menu data for "Destinations" ── */
const QUICK_DESTINATIONS = [
  { label: "Himachal Edit",    href: "/destinations/manali",       icon: "⛰️" },
  { label: "Kashmir Edit",     href: "/destinations/kashmir",      icon: "🌨️" },
  { label: "Goa Edit",         href: "/destinations/goa",          icon: "🏖️" },
  { label: "Ladakh Edit",      href: "/destinations/spiti-valley", icon: "🏔️" },
  { label: "Uttarakhand Edit", href: "/destinations/rishikesh",    icon: "🌊" },
  { label: "North East Edit",  href: "/destinations/meghalaya",    icon: "🌿" },
];

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [destOpen, setDestOpen]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, status, logout } = useAuth();
  const { theme } = useTheme();
  const destRef   = useRef<HTMLDivElement>(null);
  const userRef   = useRef<HTMLDivElement>(null);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMobileOpen(false);
    setDestOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  /* body scroll lock when mobile open */
  useEffect(() => {
    if (mobileOpen) lockScroll();
    return () => unlockScroll();
  }, [mobileOpen]);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Theme palette ── */
  const light = theme === "light";
  const c = {
    bar:            light ? "#ffffff" : "#1c1c1c",
    barScrolled:    light ? "rgba(255,255,255,0.85)" : "rgba(28,28,28,0.90)",
    border:         light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
    textStrong:     light ? "#111111" : "#ffffff",
    text:           light ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.60)",
    textMuted:      light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)",
    textFaint:      light ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)",
    pill:           light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
    panel:          light ? "#ffffff" : "#232323",
    panelBorder:    light ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)",
    panelShadow:    light ? "0 16px 64px rgba(0,0,0,0.16)" : "0 16px 64px rgba(0,0,0,0.70)",
    menuShadow:     light ? "0 12px 48px rgba(0,0,0,0.14)" : "0 12px 48px rgba(0,0,0,0.65)",
    avatarBg:       light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
    ghost:          light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
    ghostSoft:      light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
    ctaBg:          light ? "#111111" : "#ffffff",
    ctaFg:          light ? "#ffffff" : "#111111",
    menuBg:         light ? "#f7f7f8" : "#181818",
    dangerBg:       light ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.10)",
  };

  const isAuthenticated = status === "authenticated";

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  /* nav border / bg transitions */
  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 50,
    background: scrolled ? c.barScrolled : c.bar,
    borderBottom: scrolled ? `1px solid ${c.border}` : "1px solid transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
  };

  return (
    <>
      <header style={headerStyle}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

            {/* ── Logo ── */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <Image
                src="/image.png"
                alt="EditMyTrips"
                width={24}
                height={24}
                className="light:invert"
                style={{ objectFit: "contain", borderRadius: 6 }}
                priority
              />
              <span style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 17,
                color: c.textStrong,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}>
                EditMyTrips
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div
              className="hidden lg:flex items-center"
              style={{ gap: 0, flex: 1, justifyContent: "center", margin: "0 16px" }}
            >
              {NAV_LINKS.map((link) => {
                /* Destinations gets a dropdown trigger */
                if (link.href === "/destinations") {
                  return (
                    <div key={link.href} ref={destRef} style={{ position: "relative" }}>
                      <button
                        onClick={() => setDestOpen((v) => !v)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "7px 10px", borderRadius: 8,
                          fontSize: 13, fontWeight: 500,
                          color: destOpen ? c.textStrong : c.text,
                          background: destOpen ? c.pill : "transparent",
                          border: "none", cursor: "pointer",
                          transition: "color 0.15s, background 0.15s",
                          fontFamily: FONT,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.label}
                        <ChevronDown
                          style={{
                            width: 13, height: 13,
                            transition: "transform 0.2s",
                            transform: destOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>

                      {/* Mega dropdown */}
                      {destOpen && (
                        <div style={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 360,
                          background: c.panel,
                          border: `1px solid ${c.panelBorder}`,
                          borderRadius: 14,
                          boxShadow: c.panelShadow,
                          overflow: "hidden",
                          zIndex: 100,
                        }}>
                          <div style={{ padding: "14px 16px 8px", borderBottom: `1px solid ${c.border}` }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>
                              Quick destinations
                            </p>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: "8px" }}>
                            {QUICK_DESTINATIONS.map((d) => (
                              <Link
                                key={d.href}
                                href={d.href}
                                style={{
                                  display: "flex", alignItems: "center", gap: 8,
                                  padding: "10px 12px", borderRadius: 8,
                                  textDecoration: "none",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = c.pill)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <span style={{ fontSize: 16 }}>{d.icon}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: c.textStrong, fontFamily: FONT }}>
                                  {d.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div style={{ padding: "8px 16px 14px", borderTop: `1px solid ${c.border}` }}>
                            <Link
                              href="/destinations"
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                fontSize: 12, fontWeight: 600,
                                color: c.textMuted,
                                textDecoration: "none",
                              }}
                            >
                              View all destinations
                              <ArrowRight style={{ width: 13, height: 13 }} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: "7px 13px", borderRadius: 8,
                      fontSize: 13, fontWeight: 500, textDecoration: "none",
                      color: active ? c.textStrong : c.text,
                      background: active ? c.pill : "transparent",
                      transition: "color 0.15s, background 0.15s",
                      fontFamily: FONT,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Right Actions ── */}
            <div className="hidden lg:flex items-center" style={{ gap: 8 }}>
              <ThemeToggle />
              {status === "loading" ? (
                <Loader2 style={{ width: 16, height: 16, color: c.textMuted, animation: "spin 1s linear infinite" }} />
              ) : isAuthenticated ? (
                <div ref={userRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "6px 10px", borderRadius: 8, border: "none",
                      background: userMenuOpen ? c.pill : "transparent",
                      cursor: "pointer", transition: "background 0.15s",
                      fontFamily: FONT,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: c.avatarBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: c.textStrong, flexShrink: 0,
                    }}>
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: c.textStrong, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown style={{ width: 13, height: 13, color: c.textMuted, transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "none" }} />
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      width: 220, background: c.panel,
                      border: `1px solid ${c.panelBorder}`,
                      borderRadius: 12, boxShadow: c.menuShadow,
                      overflow: "hidden", zIndex: 100,
                    }}>
                      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${c.border}` }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: c.textStrong, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
                        <p style={{ fontSize: 11, color: c.textMuted, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</p>
                      </div>
                      <div style={{ padding: "6px" }}>
                        <Link
                          href="/profile"
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "9px 12px", borderRadius: 8, textDecoration: "none",
                            fontSize: 13, fontWeight: 500, color: c.text,
                            fontFamily: FONT,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = c.pill)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <User style={{ width: 14, height: 14 }} />
                          My Profile & Bookings
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%",
                            padding: "9px 12px", borderRadius: 8, border: "none",
                            background: "transparent", cursor: "pointer",
                            fontSize: 13, fontWeight: 500, color: "#f87171",
                            fontFamily: FONT,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = c.dangerBg)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <LogOut style={{ width: 14, height: 14 }} />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-login-modal"))}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: "none", background: "transparent",
                    fontSize: 13, fontWeight: 500,
                    color: c.text,
                    cursor: "pointer",
                    transition: "color 0.15s",
                    fontFamily: FONT,
                  }}
                >
                  Log in
                </button>
              )}

              {/* CTA */}
              <Link
                href="/trips"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 9,
                  background: c.ctaBg, color: c.ctaFg,
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  fontFamily: FONT,
                  transition: "opacity 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Customize Trip
                <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>

            {/* ── Mobile hamburger — only shown below 1024px ── */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "none",
                  background: c.ghost, cursor: "pointer",
                  alignItems: "center", justifyContent: "center",
                  color: c.textStrong, transition: "background 0.15s",
                  flexShrink: 0,
                }}
              >
                {mobileOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: c.menuBg,
            display: "flex", flexDirection: "column",
            paddingTop: 64,
            overflowY: "auto",
          }}
        >
          {/* Nav links */}
          <nav style={{ flex: 1, padding: "16px 20px 0" }}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderRadius: 10, textDecoration: "none",
                    marginBottom: 2,
                    fontSize: 16, fontWeight: 600,
                    color: active ? c.textStrong : c.text,
                    background: active ? c.pill : "transparent",
                    fontFamily: FONT,
                  }}
                >
                  {link.label}
                  <ArrowRight style={{ width: 15, height: 15, opacity: 0.35 }} />
                </Link>
              );
            })}

            {/* Mobile destinations quick-links */}
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: c.ghostSoft, border: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>
                Quick Destinations
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {QUICK_DESTINATIONS.map((d) => (
                  <Link
                    key={d.href}
                    href={d.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 10px", borderRadius: 7, textDecoration: "none",
                      background: c.ghostSoft,
                      fontSize: 12, fontWeight: 600, color: c.text,
                      fontFamily: FONT,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    {d.label.replace(" Edit", "")}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile bottom actions */}
          <div style={{ padding: "20px", borderTop: `1px solid ${c.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
            {isAuthenticated ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: c.ghost, marginBottom: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.textStrong, flexShrink: 0 }}>
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: c.textStrong, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
                    <p style={{ fontSize: 11, color: c.textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 10, border: `1px solid ${c.panelBorder}`, textDecoration: "none", fontSize: 14, fontWeight: 600, color: c.text, fontFamily: FONT }}
                >
                  <User style={{ width: 15, height: 15 }} />
                  Profile & Bookings
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.20)", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#f87171", fontFamily: FONT }}
                >
                  <LogOut style={{ width: 15, height: 15 }} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent("open-login-modal")); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${c.panelBorder}`, background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: c.text, fontFamily: FONT }}>
                  Log in
                </button>
                <button onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent("open-register-modal")); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${c.panelBorder}`, textDecoration: "none", fontSize: 14, fontWeight: 600, color: c.textStrong, background: c.pill, cursor: "pointer", fontFamily: FONT }}>
                  Sign up free
                </button>
              </>
            )}
            <Link
              href="/trips"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "14px", borderRadius: 10,
                background: c.ctaBg, color: c.ctaFg,
                textDecoration: "none", fontSize: 14, fontWeight: 700,
                fontFamily: FONT,
              }}
            >
              Customize Your Trip
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
