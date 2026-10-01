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

export function StatCard({ label, value, trend, icon: Icon, iconColor = "text-orange-400", prefix, suffix }: StatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral = trend === undefined || trend === 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <div className={cn("w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center", iconColor.replace("text-", "bg-").replace("400", "500/15"))}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {trendPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
          {trendNegative && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
          {trendNeutral && <Minus className="w-3.5 h-3.5 text-slate-500" />}
          <span className={cn("text-xs font-medium",
            trendPositive && "text-emerald-400",
            trendNegative && "text-red-400",
            trendNeutral && "text-slate-500"
          )}>
            {trend > 0 ? "+" : ""}{trend}% this month
          </span>
        </div>
      )}
    </div>
  );
}
