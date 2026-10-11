"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number; // percentage, positive = up, negative = down
  icon: React.ElementType;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
  /** Small contextual line under the value, e.g. "3 awaiting confirmation" */
  hint?: string;
}

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  prefix,
  suffix,
  hint,
}: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral = trend === undefined || trend === 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.09)]">
      {/* soft brand glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full bg-orange-500/[0.07] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/[0.16] to-orange-500/[0.05] ring-1 ring-orange-500/20">
          <Icon className="size-5 text-[#e85a25]" />
        </div>

        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
              trendPositive && "bg-emerald-500/10 text-emerald-600",
              trendNegative && "bg-red-500/10 text-red-600",
              trendNeutral && "bg-muted text-muted-foreground"
            )}
          >
            {trendPositive && <TrendingUp className="size-3" />}
            {trendNegative && <TrendingDown className="size-3" />}
            {trendNeutral && <Minus className="size-3" />}
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>

      <p className="mt-4 text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className="font-display mt-0.5 text-[26px] font-bold leading-9 tracking-tight text-foreground tabular-nums">
        {prefix}
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        {suffix}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-muted-foreground/90">{hint}</p>
      )}
    </div>
  );
}
