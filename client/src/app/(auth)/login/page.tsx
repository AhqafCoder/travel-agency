"use client";

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Dispatch custom event to open login modal
    window.dispatchEvent(new CustomEvent("open-login-modal"));
    // Redirect to home after modal opens
    const timer = setTimeout(() => {
      window.history.back();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
