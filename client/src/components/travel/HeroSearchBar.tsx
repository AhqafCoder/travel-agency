"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowRight, Search } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function HeroSearchBar() {
  const router = useRouter();
  const minDate = useMemo(() => todayISO(), []);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const handleFrom = (next: string) => {
    setFrom(next);
    // If new "from" is after current "to", push "to" forward
    if (next && to && parseISO(next) > parseISO(to)) {
      setTo(next);
    }
  };

  const handleTo = (next: string) => {
    setTo(next);
    // If new "to" is before current "from", pull "from" back
    if (next && from && parseISO(next) < parseISO(from)) {
      setFrom(next);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  };

  return (
    <form onSubmit={submit} className="w-full" style={{ maxWidth: 720 }}>
      <div
        className="glass-white rounded-full overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.40)" }}
      >
        <div className="flex items-stretch flex-wrap sm:flex-nowrap">
          {/* Search input */}
          <div className="flex items-center gap-2.5 flex-1 px-5 py-3.5 min-w-0">
            <Search
              className="shrink-0"
              style={{ width: 16, height: 16, color: "#9ca3af" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination or trip…"
              style={{
                width: "100%",
                fontSize: 14,
                fontWeight: 500,
                color: "#1f2937",
                background: "transparent",
                outline: "none",
                border: "none",
              }}
            />
          </div>

          {/* Divider */}
          <div
            style={{ width: 1, background: "#e5e7eb", margin: "10px 0" }}
            className="hidden sm:block"
          />

          {/* Dates – Zostel style */}
          <div className="flex items-center gap-1 px-3 py-2.5 flex-1 sm:flex-none">
            <DatePicker
              label="Check-in"
              value={from}
              minDate={minDate}
              onChange={handleFrom}
            />

            <ArrowRight
              style={{
                width: 14,
                height: 14,
                color: "#d1d5db",
                flexShrink: 0,
                margin: "0 2px",
              }}
            />

            <DatePicker
              label="Check-out"
              value={to}
              minDate={from || minDate}
              onChange={handleTo}
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 shrink-0"
            style={{
              margin: 6,
              padding: "0 22px",
              borderRadius: 9999,
              background: "#111",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer",
              minHeight: 40,
            }}
          >
            Search
          </button>
        </div>
      </div>

      <p
        className="text-center mt-2.5"
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.55)",
          fontWeight: 500,
        }}
      >
        ✦ Customize any trip · Small groups · No hidden fees
      </p>
    </form>
  );
}