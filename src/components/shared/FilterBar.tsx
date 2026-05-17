"use client";

import { useFiltersStore } from "@/store/filters.store";
import { BLOOD_GROUPS, REGIONS } from "@/lib/constants";
import type { Region, BloodGroup, JambaarGrade } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  showRegion?: boolean;
  showBloodGroup?: boolean;
  showDateRange?: boolean;
  showStatus?: boolean;
  showSearch?: boolean;
  showGrade?: boolean;
}

export function FilterBar({
  showRegion = false,
  showBloodGroup = false,
  showSearch = false,
  showGrade = false,
}: FilterBarProps) {
  const { filters, setFilter, clearFilters } = useFiltersStore();

  const hasActiveFilters =
    filters.region ||
    filters.bloodGroup ||
    filters.search ||
    filters.grade;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* SEARCH */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="w-full sm:w-[250px] pl-9 h-9"
            value={filters.search ?? ""}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>
      )}

      {/* REGION */}
      {showRegion && (
        <Select
          value={filters.region ?? "all"}
          onValueChange={(v) =>
            setFilter(
              "region",
              v === "all" ? undefined : (v as Region)
            )
          }
        >
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Toutes les régions" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* BLOOD GROUP */}
      {showBloodGroup && (
        <Select
          value={filters.bloodGroup ?? "all"}
          onValueChange={(v) =>
            setFilter(
              "bloodGroup",
              v === "all" ? undefined : (v as BloodGroup)
            )
          }
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Groupe sanguin" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tous les groupes</SelectItem>
            {BLOOD_GROUPS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* GRADE */}
      {showGrade && (
        <Select
          value={filters.grade ?? "all"}
          onValueChange={(v) =>
            setFilter(
              "grade",
              v === "all" ? undefined : (v as JambaarGrade)
            )
          }
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Tous les grades" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tous les grades</SelectItem>
            <SelectItem value="ASPIRANT">Aspirant</SelectItem>
            <SelectItem value="SENTINELLE">Sentinelle</SelectItem>
            <SelectItem value="AMBASSADEUR">Ambassadeur</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* RESET */}
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