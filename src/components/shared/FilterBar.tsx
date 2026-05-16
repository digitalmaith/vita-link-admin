"use client";

import { useFiltersStore } from "@/store/filters.store";
import { BLOOD_GROUPS, REGIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Region } from "@/types";

interface FilterBarProps {
  showRegion?: boolean;
  showBloodGroup?: boolean;
  showDateRange?: boolean;
  showStatus?: boolean;
}

export function FilterBar({
  showRegion = false,
  showBloodGroup = false,
}: FilterBarProps) {
  const { filters, setFilter, clearFilters } = useFiltersStore();
  const hasActiveFilters = filters.region || filters.bloodGroup;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showRegion && (
        <Select
          value={filters.region ?? "all"}
          onValueChange={(v) =>
            setFilter("region", v === "all" ? undefined : (v as Region))
          }
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Toutes les régions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showBloodGroup && (
        <Select
          value={filters.bloodGroup ?? "all"}
          onValueChange={(v) =>
            setFilter("region", v === "all" ? undefined : (v as Region))
          }
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Groupe sanguin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les groupes</SelectItem>
            {BLOOD_GROUPS.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 text-muted-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
