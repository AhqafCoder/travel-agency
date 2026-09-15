"use client";

import { useState } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TravellerSelectorProps {
  count: number;
  onChange: (count: number) => void;
  max: number;
  minAge: number;
}

export function TravellerSelector({ count, onChange, max, minAge }: TravellerSelectorProps) {
  const [showAgeNote, setShowAgeNote] = useState(false);

  const increment = () => {
    if (count < max) onChange(count + 1);
  };

  const decrement = () => {
    if (count > 1) onChange(count - 1);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Travellers
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-xs text-muted-foreground hover:text-primary"
          onClick={() => setShowAgeNote(!showAgeNote)}
        >
          <span className="underline">Min age: {minAge}+</span>
        </Button>
      </div>

      {/* Age restriction notice */}
      {showAgeNote && (
        <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          All travellers must be at least {minAge} years old on the departure date.
        </div>
      )}

      {/* Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={count <= 1}
            className="h-10 w-10"
            aria-label="Decrease travellers"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center text-xl font-semibold text-foreground">{count}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            disabled={count >= max}
            className="h-10 w-10"
            aria-label="Increase travellers"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Max capacity indicator */}
        <div className="text-right text-xs text-muted-foreground">
          <p>Max: {max} travellers</p>
          {count > 1 && (
            <p className="mt-0.5 text-primary text-sm font-medium">
              {count} travellers selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}