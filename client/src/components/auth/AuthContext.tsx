"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import {
  api,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
  ApiError,
} from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  // Restore session from localStorage, then re-validate token with the server.
  useEffect(() => {
    let cancelled = false;

    const stored = getStoredUser();
    const token = getToken();

    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    // Optimistically restore the cached user for instant UI.
    if (stored) setUser(stored);

    api
      .me()
      .then((fresh) => {
        if (cancelled) return;
        setUser(fresh);
        setStoredUser(fresh);
        setStatus("authenticated");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          // Token expired or invalid — clear the session.
          setToken(null);
          setStoredUser(null);
          setUser(null);
        }
        setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedIn } = await api.login({ email, password });
    setToken(token);
    setStoredUser(loggedIn);
    setUser(loggedIn);
    setStatus("authenticated");
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      const { token, user: created } = await api.register(input);
      setToken(token);
      setStoredUser(created);
      setUser(created);
      setStatus("authenticated");
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}