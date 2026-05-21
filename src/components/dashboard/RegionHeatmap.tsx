"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Map as MapIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { useFiltersStore } from "@/store/filters.store";
import { REGIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Region, HeatmapDataPoint } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

type SortMode = "name" | "demand-desc" | "demand-asc";
type FilterLevel = "all" | "critical" | "high" | "moderate" | "low";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDemandColor(level: number) {
  if (level >= 75) return {
    bg: "from-red-600 via-red-500 to-red-700",
    shadow: "shadow-red-500/30",
    border: "border-red-400/30",
    text: "text-white",
    subtext: "text-red-100",
    bar: "bg-white/40",
    badge: "bg-red-500",
    glow: "shadow-red-500/50"
  };
  if (level >= 50) return {
    bg: "from-orange-500 via-orange-400 to-orange-600",
    shadow: "shadow-orange-500/30",
    border: "border-orange-400/30",
    text: "text-white",
    subtext: "text-orange-100",
    bar: "bg-white/40",
    badge: "bg-orange-500",
    glow: "shadow-orange-500/50"
  };
  if (level >= 25) return {
    bg: "from-amber-400 via-amber-300 to-amber-500",
    shadow: "shadow-amber-500/30",
    border: "border-amber-400/30",
    text: "text-amber-950",
    subtext: "text-amber-800",
    bar: "bg-amber-200/60",
    badge: "bg-amber-500",
    glow: "shadow-amber-500/50"
  };
  return {
    bg: "from-emerald-400 via-emerald-300 to-emerald-500",
    shadow: "shadow-emerald-500/30",
    border: "border-emerald-400/30",
    text: "text-emerald-950",
    subtext: "text-emerald-800",
    bar: "bg-emerald-200/60",
    badge: "bg-emerald-500",
    glow: "shadow-emerald-500/50"
  };
}

function getDemandInfo(level: number) {
  if (level >= 75) return { icon: Flame, label: "Critique", color: "text-red-200" };
  if (level >= 50) return { icon: TrendingUp, label: "Élevée", color: "text-orange-200" };
  if (level >= 25) return { icon: Activity, label: "Modérée", color: "text-amber-200" };
  return { icon: TrendingDown, label: "Faible", color: "text-emerald-200" };
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }),
  hover: {
    scale: 1.08,
    y: -8,
    transition: {
      duration: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const filterBarVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    marginBottom: "1rem",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-xl">
    <Skeleton className="h-28 w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted/30" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RegionHeatmap() {
  const { filters } = useFiltersStore();
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { 
    data: heatmapData = [], 
    isLoading, 
    isError,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ["dashboard", "heatmap", filters],
    queryFn: () => dashboardService.getHeatmapData(filters),
    refetchInterval: 300000, // Rafraîchir toutes les 5 minutes
  });

  // -------------------------------------------------------------------------
  // Données calculées
  // -------------------------------------------------------------------------

  const demandByRegion = useMemo(() => 
    new Map<Region, number>(
      heatmapData.map((p: HeatmapDataPoint) => [p.region, p.demandLevel])
    ),
    [heatmapData]
  );

  const stats = useMemo(() => {
    if (heatmapData.length === 0) return null;
    
    const avg = Math.round(
      heatmapData.reduce((acc: number, p: HeatmapDataPoint) => acc + p.demandLevel, 0) / heatmapData.length
    );
    
    const critical = heatmapData.filter((p: HeatmapDataPoint) => p.demandLevel >= 75).length;
    const high = heatmapData.filter((p: HeatmapDataPoint) => p.demandLevel >= 50 && p.demandLevel < 75).length;
    const moderate = heatmapData.filter((p: HeatmapDataPoint) => p.demandLevel >= 25 && p.demandLevel < 50).length;
    const low = heatmapData.filter((p: HeatmapDataPoint) => p.demandLevel < 25).length;
    
    const top = heatmapData.reduce((max: HeatmapDataPoint, p: HeatmapDataPoint) => 
      p.demandLevel > max.demandLevel ? p : max, 
      heatmapData[0]
    );

    return { avg, critical, high, moderate, low, top };
  }, [heatmapData]);

  // -------------------------------------------------------------------------
  // Filtrage et tri
  // -------------------------------------------------------------------------

  const filteredRegions = useMemo(() => {
    let regions = REGIONS.filter(region => {
      const level = demandByRegion.get(region) ?? 0;
      
      // Filtre par niveau
      if (filterLevel === "critical" && level < 75) return false;
      if (filterLevel === "high" && (level < 50 || level >= 75)) return false;
      if (filterLevel === "moderate" && (level < 25 || level >= 50)) return false;
      if (filterLevel === "low" && level >= 25) return false;
      
      // Recherche textuelle
      if (searchQuery && !region.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Tri
    return regions.sort((a, b) => {
      const levelA = demandByRegion.get(a) ?? 0;
      const levelB = demandByRegion.get(b) ?? 0;
      
      switch (sortMode) {
        case "demand-desc": return levelB - levelA;
        case "demand-asc": return levelA - levelB;
        default: return a.localeCompare(b);
      }
    });
  }, [REGIONS, demandByRegion, filterLevel, searchQuery, sortMode]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <Card className="h-full overflow-hidden border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card via-card to-background">
      {/* Header */}
      <CardHeader className="pb-4 space-y-4">
        {/* Titre et actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner">
              <MapIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Carte de chaleur
              </span>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                Demande en sang par région
              </p>
            </div>
          </CardTitle>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 transition-all duration-300",
                showFilters && "bg-primary/10 border-primary/30"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {(filterLevel !== "all" || searchQuery) && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="relative"
            >
              <RefreshCw className={cn(
                "w-4 h-4 transition-all duration-300",
                isFetching && "animate-spin text-primary"
              )} />
            </Button>
          </div>
        </div>

        {/* Barre de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterBarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-3 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                {/* Recherche */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une région..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>

                {/* Filtre par niveau */}
                <Select
                  value={filterLevel}
                  onValueChange={(value) => setFilterLevel(value as FilterLevel)}
                >
                  <SelectTrigger className="w-[180px] bg-background/50">
                    <SelectValue placeholder="Niveau de demande" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="critical">
                      <span className="flex items-center gap-2">
                        <Flame className="w-3 h-3 text-red-500" />
                        Critique (75%+)
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-orange-500" />
                        Élevée (50-74%)
                      </span>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <span className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-amber-500" />
                        Modérée (25-49%)
                      </span>
                    </SelectItem>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="w-3 h-3 text-emerald-500" />
                        Faible (&lt;25%)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Tri */}
                <Select
                  value={sortMode}
                  onValueChange={(value) => setSortMode(value as SortMode)}
                >
                  <SelectTrigger className="w-[180px] bg-background/50">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Par nom</SelectItem>
                    <SelectItem value="demand-desc">Demande ↓</SelectItem>
                    <SelectItem value="demand-asc">Demande ↑</SelectItem>
                  </SelectContent>
                </Select>

                {/* Reset */}
                {(filterLevel !== "all" || searchQuery || sortMode !== "name") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterLevel("all");
                      setSearchQuery("");
                      setSortMode("name");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistiques rapides */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <p className="text-2xl font-bold">{stats.avg}%</p>
              <p className="text-xs text-muted-foreground">Moyenne</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/5 to-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
              </div>
              <p className="text-xs text-muted-foreground">Critiques</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{stats.high}</p>
              </div>
              <p className="text-xs text-muted-foreground">Élevées</p>
            </div>
            {stats.top && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-bold text-amber-500 truncate">{stats.top.region}</p>
                </div>
                <p className="text-xs text-muted-foreground">Plus critique ({stats.top.demandLevel}%)</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Légende */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
          {[
            { color: "from-emerald-400 to-emerald-500", label: "Faible (<25%)", pulse: false },
            { color: "from-amber-400 to-amber-500", label: "Modérée (25-49%)", pulse: false },
            { color: "from-orange-500 to-orange-600", label: "Élevée (50-74%)", pulse: false },
            { color: "from-red-600 to-red-700", label: "Critique (75%+)", pulse: true },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className={cn(
                "w-3 h-3 rounded-full bg-gradient-to-br shadow-sm",
                item.color,
                item.pulse && "animate-pulse"
              )} />
              {item.label}
            </span>
          ))}
        </div>
      </CardHeader>

      {/* Contenu */}
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive/30" />
            <p className="text-lg font-semibold text-destructive">Erreur de chargement</p>
            <p className="text-sm text-muted-foreground mt-2">
              Impossible de charger les données de la carte de chaleur
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </motion.div>
        ) : filteredRegions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-semibold">Aucune région trouvée</p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchQuery 
                ? `Aucune région ne correspond à "${searchQuery}"`
                : "Aucune région ne correspond aux filtres sélectionnés"
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterLevel("all");
                setSearchQuery("");
                setSortMode("name");
              }}
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredRegions.map((region, index) => {
                  const level = demandByRegion.get(region) ?? 0;
                  const colors = getDemandColor(level);
                  const info = getDemandInfo(level);
                  const DemandIcon = info.icon;

                  return (
                    <motion.div
                      key={region}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      className="relative group cursor-pointer"
                    >
                      <div className={cn(
                        "relative overflow-hidden rounded-xl bg-gradient-to-br p-4 transition-all duration-500",
                        colors.bg,
                        colors.text,
                        "shadow-lg hover:shadow-2xl",
                        colors.glow,
                        "border border-white/10"
                      )}>
                        {/* Effet de verre */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
                        
                        {/* Animation de particules */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full animate-ping" />
                          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping delay-300" />
                        </div>

                        {/* Contenu */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-bold truncate max-w-[120px]">
                              {region}
                            </p>
                            <DemandIcon className={cn("w-4 h-4 shrink-0", info.color)} />
                          </div>
                          
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <motion.p 
                              className="text-3xl font-black leading-tight"
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {level}
                            </motion.p>
                            <p className="text-sm font-medium opacity-80">%</p>
                          </div>
                          
                          {/* Barre de progression animée */}
                          <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${level}%` }}
                              transition={{ 
                                duration: 1, 
                                delay: index * 0.03,
                                ease: "easeOut"
                              }}
                              className={cn(
                                "h-full rounded-full",
                                colors.bar,
                                "shadow-inner"
                              )}
                            />
                          </div>
                          
                          <p className="text-xs font-semibold mt-2 opacity-90 flex items-center gap-1">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              level >= 75 ? "bg-red-300" : 
                              level >= 50 ? "bg-orange-300" : 
                              level >= 25 ? "bg-amber-300" : "bg-emerald-300"
                            )} />
                            {info.label}
                          </p>
                        </div>

                        {/* Badge critique */}
                        <AnimatePresence>
                          {level >= 75 && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 15,
                                delay: index * 0.03 + 0.3
                              }}
                              className="absolute -top-2 -right-2"
                            >
                              <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center shadow-xl",
                                colors.badge,
                                "animate-pulse"
                              )}>
                                <Flame className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Compteur de résultats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-muted-foreground">
                {filteredRegions.length} région{filteredRegions.length > 1 ? 's' : ''} affichée{filteredRegions.length > 1 ? 's' : ''}
                {filteredRegions.length !== REGIONS.length && (
                  <> sur {REGIONS.length} au total</>
                )}
              </p>
            </motion.div>
          </>
        )}
      </CardContent>

      {/* Footer */}
      {!isLoading && heatmapData.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Dernière mise à jour : {new Date().toLocaleString('fr-FR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </Card>
  );
}