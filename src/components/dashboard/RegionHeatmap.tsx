"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map as MapIcon, TrendingUp, TrendingDown, Activity, Flame, Users } from "lucide-react";
import { useFiltersStore } from "@/store/filters.store";
import { REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Niveau de criticité par couleur avec gradients
function getDemandColor(level: number): string {
  if (level >= 75) return "from-red-600 to-red-700 text-white shadow-red-500/20";
  if (level >= 50) return "from-orange-500 to-orange-600 text-white shadow-orange-500/20";
  if (level >= 25) return "from-amber-400 to-amber-500 text-amber-950 shadow-amber-500/20";
  return "from-emerald-500 to-green-600 text-white shadow-emerald-500/20";
}

// Icône et texte du niveau
function getDemandInfo(level: number) {
  if (level >= 75) return { icon: Flame, label: "Critique", color: "text-red-200" };
  if (level >= 50) return { icon: TrendingUp, label: "Élevée", color: "text-orange-200" };
  if (level >= 25) return { icon: Activity, label: "Modérée", color: "text-amber-200" };
  return { icon: TrendingDown, label: "Faible", color: "text-emerald-200" };
}

// Animation variants pour les cartes
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      type: "spring" as const,
      stiffness: 200,
      damping: 15
    }
  }),
  hover: {
    scale: 1.05,
    y: -4,
    transition: {
      duration: 0.2,
      type: "spring" as const,
      stiffness: 300
    }
  },
  tap: { scale: 0.98 }
};

// Skeleton animé
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative overflow-hidden rounded-xl"
  >
    <Skeleton className="h-24 w-full rounded-xl" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </motion.div>
);

export function RegionHeatmap() {
  const { filters } = useFiltersStore();

  const { data: regionsStats = [], isLoading } = useQuery<RegionStats[]>({
    queryKey: ["dashboard", "regions-stats", filters],
    queryFn: () => dashboardService.getRegionsStats(filters),
  });

  // Créer une Map pour un accès rapide par région
  const statsByRegion = new Map<string, RegionStats>(
    regionsStats.map((stat) => [stat.region, stat])
  );

  // Calcul des statistiques globales
  const avgDemand = regionsStats.length > 0
    ? Math.round(regionsStats.reduce((acc, stat) => acc + stat.demandLevel, 0) / regionsStats.length)
    : 0;
  
  const criticalRegions = regionsStats.filter(stat => stat.demandLevel >= 75).length;
  const highDemandRegions = regionsStats.filter(stat => stat.demandLevel >= 50 && stat.demandLevel < 75).length;
  const totalDonors = regionsStats.reduce((acc, stat) => acc + stat.donorsCount, 0);

  // Trouver la région avec la plus forte demande
  const topRegion = regionsStats.length > 0
    ? regionsStats.reduce((max, stat) => stat.demandLevel > max.demandLevel ? stat : max, regionsStats[0])
    : null;

  return (
    <Card className="h-full overflow-hidden border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <MapIcon className="w-4 h-4 text-primary" />
            </div>
            <span>Carte de chaleur — Demande en sang par région</span>
          </CardTitle>
          
          {/* Badge statistique */}
          {!isLoading && regionsStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <div className="text-right">
                <p className="text-2xl font-bold leading-none">{avgDemand}%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Moyenne</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <p className="text-lg font-bold leading-none">{criticalRegions}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Critiques</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats rapides */}
        {!isLoading && regionsStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center gap-3 text-xs"
          >
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/30">
              <Flame className="w-3 h-3 text-red-500" />
              <span className="font-medium">{criticalRegions}</span>
              <span className="text-muted-foreground">régions critiques</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/30">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="font-medium">{highDemandRegions}</span>
              <span className="text-muted-foreground">à forte demande</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/30">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="font-medium">{totalDonors}</span>
              <span className="text-muted-foreground">donneurs totaux</span>
            </div>
            {topRegion && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/30">
                <MapIcon className="w-3 h-3 text-primary" />
                <span className="font-medium">{topRegion.region}</span>
                <span className="text-muted-foreground">plus critique</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Légende améliorée */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm" />
            Faible (&lt;25%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm" />
            Modérée (25-49%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm" />
            Élevée (50-74%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-sm animate-pulse" />
            Critique (75%+)
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: REGIONS.length }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {REGIONS.map((region, index) => {
                const regionStat = statsByRegion.get(region);
                const level = regionStat?.demandLevel ?? 0;
                const donors = regionStat?.donorsCount ?? 0;
                const DemandIcon = getDemandInfo(level).icon;
                const demandInfo = getDemandInfo(level);
                const gradientClass = getDemandColor(level);
                
                return (
                  <motion.div
                    key={region}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <div className={cn(
                      "relative overflow-hidden rounded-xl bg-gradient-to-br p-3 transition-all duration-300 cursor-pointer",
                      gradientClass,
                      "shadow-md hover:shadow-xl"
                    )}>
                      {/* Effet de brillance au hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/10 to-transparent" />
                      
                      {/* Effet de vague */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      
                      {/* Contenu */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs font-semibold truncate max-w-[100px]">
                            {region}
                          </p>
                          <DemandIcon className={cn("w-3 h-3", demandInfo.color)} />
                        </div>
                        
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold leading-tight">{level}</p>
                          <p className="text-xs opacity-80">%</p>
                        </div>

                        {/* Nombre de donneurs */}
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-80">{donors}</span>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${level}%` }}
                            transition={{ duration: 0.8, delay: index * 0.02 }}
                            className="h-full bg-white/30 rounded-full"
                          />
                        </div>
                        
                        <p className="text-[10px] font-medium mt-1.5 opacity-90">
                          {demandInfo.label}
                        </p>
                      </div>

                      {/* Badge pour les régions critiques */}
                      {level >= 75 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
                          className="absolute -top-1 -right-1"
                        >
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <Flame className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Message d'état vide */}
        {!isLoading && regionsStats.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
              <MapIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Ajustez vos filtres pour voir les données
            </p>
          </motion.div>
        )}
      </CardContent>

      {/* Footer avec timestamp */}
      {!isLoading && regionsStats.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Dernière mise à jour : {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </Card>
  );
}