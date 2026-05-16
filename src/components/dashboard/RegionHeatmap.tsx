"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map as MapIcon } from "lucide-react";
import { useFiltersStore } from "@/store/filters.store";
import { REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { HeatmapPoint, Region } from "@/types";

// Niveau de criticité par couleur
function getDemandColor(level: number): string {
  if (level >= 75) return "bg-red-600 text-white";
  if (level >= 50) return "bg-orange-400 text-white";
  if (level >= 25) return "bg-amber-300 text-amber-900";
  return "bg-green-100 text-green-800";
}

export function RegionHeatmap() {
  const { filters } = useFiltersStore();

  const { data: heatmapData = [] , isLoading } = useQuery({
    queryKey: ["dashboard", "heatmap", filters],
    queryFn: () => dashboardService.getHeatmapData(filters),
  });

  const demandByRegion = new Map<Region, number>(
    heatmapData.map((p) => [p.region, p.demandLevel])
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-primary" />
          Carte de chaleur — Demande en sang par région
        </CardTitle>
        {/* Légende */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 inline-block" />
            Faible
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-amber-300 inline-block" />
            Modérée
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" />
            Élevée
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" />
            Critique
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {REGIONS.map((region) => {
              const level = demandByRegion.get(region) ?? 0;
              return (
                <div
                  key={region}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-center transition-transform hover:scale-105 cursor-default",
                    getDemandColor(level)
                  )}
                >
                  <p className="text-xs font-semibold truncate">{region}</p>
                  <p className="text-lg font-bold leading-tight">{level}%</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}