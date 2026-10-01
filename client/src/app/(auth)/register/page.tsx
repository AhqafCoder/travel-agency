"use client";

import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Dispatch custom event to open register modal
    window.dispatchEvent(new CustomEvent("open-register-modal"));
    // Redirect to home after modal opens
    const timer = setTimeout(() => {
      window.history.back();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}