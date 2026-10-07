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
}

export function StatCard({ label, value, trend, icon: Icon, iconColor = "text-orange-600", prefix, suffix }: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral = trend === undefined || trend === 0;

  return (
    <div className="group bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-muted-foreground font-medium">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#FF6B35]" />
        </div>
      </div>
      <p className="text-[1.7rem] leading-8 font-bold text-foreground tabular-nums tracking-tight">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {trendPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
          {trendNegative && <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
          {trendNeutral && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
          <span className={cn("text-xs font-medium",
            trendPositive && "text-emerald-600",
            trendNegative && "text-red-600",
            trendNeutral && "text-muted-foreground"
          )}>
            {trend > 0 ? "+" : ""}{trend}% this month
          </span>
        </div>
      )}
    </div>
  );
}
