"use client";

import { cn } from "@/lib/utils";

const legendItems = [
  { color: "bg-gradient-to-br from-emerald-400 to-green-500", label: "Faible", range: "<25%" },
  { color: "bg-gradient-to-br from-yellow-400 to-amber-500", label: "Modérée", range: "25-49%" },
  { color: "bg-gradient-to-br from-amber-500 to-orange-600", label: "Élevée", range: "50-74%" },
  { color: "bg-gradient-to-br from-rose-600 to-red-700", label: "Critique", range: "75%+", pulse: true },
];

export function HeatmapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/30">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <span className={cn("w-3 h-3 rounded-full shadow-sm", item.color, item.pulse && "animate-pulse")} />
          {item.label}
          <span className="text-[10px] opacity-60">({item.range})</span>
        </div>
      ))}
    </div>
  );
}