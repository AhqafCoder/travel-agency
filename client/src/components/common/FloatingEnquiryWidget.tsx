"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { EnquiryModal } from "./EnquiryModal";
import { WhatsAppIcon } from "./BrandIcons";
import { SITE } from "@/lib/constants";

const AUTO_SHOWN_KEY = "emt_enquiry_auto_shown";

/**
 * Floating widget that auto-opens the enquiry modal at most once per browser
 * session (after a short delay). Users can always open it via the button.
 */
export function FloatingEnquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(AUTO_SHOWN_KEY)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(AUTO_SHOWN_KEY, "1");
      setIsOpen(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating Action Buttons – WhatsApp chat + manual enquiry trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <a
          href={SITE.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <WhatsAppIcon className="w-7 h-7 transition-transform duration-200 group-hover:-rotate-6" />
        </a>

        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/40 ring-1 ring-black/10 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Enquire Now
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
