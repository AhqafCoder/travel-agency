"use client";

import * as React from "react";
import { format, parseISO, isValid, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // or wherever your cn helper lives

interface DatePickerProps {
  label?: string;
  value: string; // ISO yyyy-MM-dd or empty
  onChange: (next: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  const min = minDate ? startOfDay(parseISO(minDate)) : undefined;
  const max = maxDate ? startOfDay(parseISO(maxDate)) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange("");
      return;
    }
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex flex-col items-start text-left min-w-[92px] px-1 py-0.5 rounded-md hover:bg-black/5 transition-colors",
            className
          )}
        >
          {label && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {label}
            </span>
          )}
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: selected ? "#374151" : "#9ca3af",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {selected ? (
              format(selected, "d MMM")
            ) : (
              <>
                <CalendarIcon style={{ width: 14, height: 14 }} />
                Pick a date
              </>
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={(date) => {
            if (min && date < min) return true;
            if (max && date > max) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}