"use client";

import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Dispatch custom event to open register modal
    window.dispatchEvent(new CustomEvent("open-register-modal"));
    // Redirect to home after modal opens
    const timer = setTimeout(() => {
      // Direct visit with no history would strand the user on a blank page.
      if (window.history.length <= 1) window.location.replace("/");
      else window.history.back();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}