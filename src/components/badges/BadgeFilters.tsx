"use client";

import { cn } from "@/lib/utils";

interface BadgeFiltersProps {
  activeFilter: "all" | "active" | "inactive";
  onFilterChange: (filter: "all" | "active" | "inactive") => void;
  counts: { all: number; active: number; inactive: number };
}

export function BadgeFilters({ activeFilter, onFilterChange, counts }: BadgeFiltersProps) {
  const filters = [
    { key: "all" as const, label: "Tous", count: counts.all },
    { key: "active" as const, label: "Actifs", count: counts.active },
    { key: "inactive" as const, label: "Inactifs", count: counts.inactive },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeFilter === filter.key
              ? "bg-white dark:bg-gray-800 text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {filter.label}
          <span className="ml-1.5 text-[10px] opacity-60">({filter.count})</span>
        </button>
      ))}
    </div>
  );
}