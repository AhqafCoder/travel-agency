"use client";

import { TripDeparture } from "@/types";
import { format } from "date-fns";
import { Calendar, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  departures: TripDeparture[];
  selected: TripDeparture | null;
  onSelect: (departure: TripDeparture) => void;
}

export function DateSelector({ departures, selected, onSelect }: DateSelectorProps) {
  if (departures.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Select Departure Date
        </h3>
        <div className="p-4 rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
          No upcoming departures available. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        Select Departure Date
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {departures.map((dep) => (
          <button
            key={dep._id}
            onClick={() => onSelect(dep)}
            className={cn(
              "w-full p-3 rounded-lg border text-left transition-all",
              selected?._id === dep._id
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                : "border-border/30 hover:border-primary/40 hover:bg-accent/30",
              dep.availableSeats <= 3 && "border-orange-300 bg-orange-50/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(dep.startDate), "MMM d, yyyy")} — {format(new Date(dep.endDate), "MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dep.meetingPoint} • {dep.meetingTime}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {selected?._id === dep._id && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">₹{dep.price.toLocaleString()}</p>
                  <p className={cn(
                    "text-xs font-medium",
                    dep.availableSeats <= 3 ? "text-orange-600" : "text-teal"
                  )}>
                    {dep.availableSeats} seats left
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
