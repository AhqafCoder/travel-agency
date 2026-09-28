"use client";

import { TripDeparture } from "@/types";
import { format } from "date-fns";
import { Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  departures: TripDeparture[];
  selected: TripDeparture | null;
  onSelect: (departure: TripDeparture) => void;
}

export function DateSelector({
  departures,
  selected,
  onSelect,
}: DateSelectorProps) {
  if (departures.length === 0) {
    return (
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Departure Date
        </h3>
        <div className="p-4 rounded-xl bg-white/4 border border-white/6 text-center text-sm text-muted-foreground">
          No upcoming departures. Check back soon.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-primary" />
        Select Departure Date
      </h3>
      <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin">
        {departures.map((dep) => {
          const isSelected = selected?._id === dep._id;
          const isLow = dep.availableSeats <= 3;
          return (
            <button
              key={dep._id}
              onClick={() => onSelect(dep)}
              className={cn(
                "w-full p-3.5 rounded-xl border text-left transition-all duration-200",
                isSelected
                  ? "border-primary/50 bg-primary/8 ring-1 ring-primary/20"
                  : isLow
                  ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                  : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {format(new Date(dep.startDate), "MMM d")}
                    {" — "}
                    {format(new Date(dep.endDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {dep.meetingPoint}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      ₹{dep.price.toLocaleString("en-IN")}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-medium",
                        isLow ? "text-amber-400" : "text-emerald-400"
                      )}
                    >
                      {dep.availableSeats} seats left
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
