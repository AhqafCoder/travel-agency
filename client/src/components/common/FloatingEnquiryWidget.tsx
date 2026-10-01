"use client";

import { useState, useEffect } from "react";
import { EnquiryModal } from "./EnquiryModal";

/**
 * Floating widget that automatically shows the enquiry modal three times,
 * spaced 20 seconds apart. Users can also manually open it via the button.
 */
export function FloatingEnquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCount, setShowCount] = useState(0);

  // Automatic pop‑up logic – show up to three times, every 20 seconds.
  useEffect(() => {
    if (showCount >= 3) return; // stop after three displays
    const interval = setInterval(() => {
      setIsOpen(true);
      setShowCount((c) => c + 1);
    }, 20000);
    return () => clearInterval(interval);
  }, [showCount]);

  return (
    <>
      {/* Floating Action Button – optional manual trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-800 text-white rounded-2xl"
        >
          Enquire Now
        </button>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
