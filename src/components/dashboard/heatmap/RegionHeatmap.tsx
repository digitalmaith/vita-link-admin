"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";
import { useFiltersStore } from "@/store/filters.store";
import { REGIONS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import type { RegionStats } from "@/types";

import { HeatmapCard } from "./HeatmapCard";
import { HeatmapSkeleton } from "./HeatmapSkeleton";
import { HeatmapLegend } from "./HeatmapLegend";
import { HeatmapStats } from "./HeatmapStats";
import { RegionDetailModal } from "./RegionDetailModal";

export function RegionHeatmap() {
  const { filters } = useFiltersStore();
  const [selectedRegion, setSelectedRegion] = useState<RegionStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: regionsStats = [], isLoading } = useQuery<RegionStats[]>({
    queryKey: ["dashboard", "regions-stats", filters],
    queryFn: () => dashboardService.getRegionsStats(filters),
  });

  const statsByRegion = useMemo(
    () => new Map(regionsStats.map((stat) => [stat.region, stat])),
    [regionsStats]
  );

  const stats = useMemo(() => {
    const avgDemand =
      regionsStats.length > 0
        ? Math.round(regionsStats.reduce((acc, stat) => acc + stat.demandLevel, 0) / regionsStats.length)
        : 0;

    const criticalRegions = regionsStats.filter((stat) => stat.demandLevel >= 75).length;
    const highDemandRegions = regionsStats.filter(
      (stat) => stat.demandLevel >= 50 && stat.demandLevel < 75
    ).length;
    const totalDonors = regionsStats.reduce((acc, stat) => acc + stat.donorsCount, 0);
    const topRegion =
      regionsStats.length > 0
        ? regionsStats.reduce((max, stat) => (stat.demandLevel > max.demandLevel ? stat : max))
        : null;

    return { avgDemand, criticalRegions, highDemandRegions, totalDonors, topRegion };
  }, [regionsStats]);

  const handleRegionClick = (regionStat: RegionStats) => {
    setSelectedRegion(regionStat);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="h-full overflow-hidden border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 space-y-4">
          {/* Header principal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 ring-1 ring-primary/10">
                <MapIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Carte de chaleur</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Demande en sang par région</p>
              </div>
            </div>

            {!isLoading && <HeatmapStats regionsStats={regionsStats} {...stats} />}
          </div>

          {!isLoading && <HeatmapStats regionsStats={regionsStats} {...stats} />}
          <HeatmapLegend />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: REGIONS.length }).map((_, i) => (
                <HeatmapSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {REGIONS.map((region, index) => (
                  <HeatmapCard
                    key={region}
                    region={region}
                    regionStat={statsByRegion.get(region)}
                    index={index}
                    onClick={handleRegionClick}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Message d'état vide */}
          {!isLoading && regionsStats.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
                <MapIcon className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Aucune donnée disponible</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Ajustez vos filtres pour voir les données régionales
              </p>
            </motion.div>
          )}
        </CardContent>

        {/* Footer avec statistiques */}
        {!isLoading && regionsStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-6 pb-4 flex items-center justify-between text-[11px] text-muted-foreground/70"
          >
            <span>
              {regionsStats.length} région{regionsStats.length > 1 ? "s" : ""} analysée{regionsStats.length > 1 ? "s" : ""}
            </span>
            <span>Mis à jour : {new Date().toLocaleTimeString()}</span>
          </motion.div>
        )}
      </Card>

      <RegionDetailModal region={selectedRegion} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}