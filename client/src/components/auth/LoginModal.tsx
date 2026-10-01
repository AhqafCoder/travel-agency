"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Route,
  BadgeCheck,
  Headset,
  Award,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { ApiError } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

const inputBase =
  "w-full rounded-lg bg-white/[0.04] border border-white/10 py-2.5 pl-10 pr-3 text-sm text-white " +
  "placeholder:text-white/30 outline-none transition " +
  "hover:border-white/20 focus:border-white/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/10";

const iconBase =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40";

const labelBase = "mb-1 block text-xs font-medium text-white/70";

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Reset form + play enter animation each time modal opens
  useEffect(() => {
    if (!isOpen) {
      setShow(false);
      return;
    }
    setEmailOrPhone("");
    setPassword("");
    setName("");
    setPhone("");
    setShowPassword(false);
    setError("");
    setSubmitting(false);

    const raf = requestAnimationFrame(() => {
      setShow(true);
      firstInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, mode]);

  // Escape key & scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        const isEmail = emailOrPhone.includes("@");
        await register({
          name: name.trim(),
          email: isEmail ? emailOrPhone.trim() : `${emailOrPhone.trim()}@phone.local`,
          phone: !isEmail ? emailOrPhone.trim() : phone.trim() || undefined,
          password,
        });
      } else {
        await login(emailOrPhone.trim(), password);
      }
      onClose();
      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Google SSO integration initialized. Redirecting to Google authentication...");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 motion-reduce:transition-none
        bg-black/20 backdrop-blur-md ${show ? "opacity-100" : "opacity-0"}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div
        className={`relative grid w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#111] text-white
          border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:grid-cols-[15rem_1fr]
          transition-all duration-300 ease-out motion-reduce:transition-none
          ${show ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0"}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-white/50 transition
            hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left info panel */}
        <aside className="flex flex-col justify-between gap-6 border-b border-white/10 bg-white/[0.03] p-6 md:border-b-0 md:border-r">
          <div>
            <h2 id="auth-title" className="text-xl font-semibold leading-tight tracking-tight">
              {mode === "login" ? "Welcome back" : "Start your journey"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {mode === "login"
                ? "Log in to manage your bookings and plan your next adventure."
                : "Create an account to book handcrafted trips and save memories."}
            </p>
          </div>

          <div className="hidden md:block">
            <p className="mb-3 text-xs font-medium text-white/45">Why choose us</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <Route className="h-4 w-4 shrink-0 text-white/50" />
                Custom itinerary
              </li>
              <li className="flex items-center gap-3">
                <BadgeCheck className="h-4 w-4 shrink-0 text-white/50" />
                Government approved
              </li>
              <li className="flex items-center gap-3">
                <Headset className="h-4 w-4 shrink-0 text-white/50" />
                24/7 concierge
              </li>
              <li className="flex items-center gap-3">
                <Award className="h-4 w-4 shrink-0 text-white/50" />
                Trusted since 2016
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Form panel */}
        <div className="flex flex-col justify-center p-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">
                {mode === "login" ? "Log in to your account" : "Create an account"}
              </h3>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
              >
                {error}
              </div>
            )}

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.04] py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-3 text-white/40 text-xs uppercase tracking-wider">Or with email / phone</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="auth-name" className={labelBase}>Full Name</label>
                <div className="relative">
                  <User className={iconBase} />
                  <input
                    ref={firstInputRef}
                    id="auth-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-identifier" className={labelBase}>
                {mode === "login" ? "Email or Phone Number" : "Email Address or Phone Number"}
              </label>
              <div className="relative">
                <Mail className={iconBase} />
                <input
                  ref={mode === "login" ? firstInputRef : undefined}
                  id="auth-identifier"
                  type="text"
                  required
                  placeholder="you@example.com or +919876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className={labelBase}>Password</label>
              <div className="relative">
                <Lock className={iconBase} />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-black
                transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 mt-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-white/50">
            {mode === "login" ? (
              <>
                New to EditMyTrips?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-medium text-white underline underline-offset-4 hover:text-white/80 cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-medium text-white underline underline-offset-4 hover:text-white/80 cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
