"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Users, Map as MapIcon } from "lucide-react";
import type { RegionStats } from "@/types";

interface HeatmapStatsProps {
  regionsStats: RegionStats[];
  avgDemand: number;
  criticalRegions: number;
  highDemandRegions: number;
  totalDonors: number;
  topRegion: RegionStats | null;
}

export function HeatmapStats({
  regionsStats,
  avgDemand,
  criticalRegions,
  highDemandRegions,
  totalDonors,
  topRegion,
}: HeatmapStatsProps) {
  if (regionsStats.length === 0) return null;

  return (
    <>
      {/* Badge statistique */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mt-3 gap-3 bg-muted/50 backdrop-blur-sm rounded-xl px-2.5 py-1"
      >
        <div className="text-center px-2">
          <p className="text-sm font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {avgDemand}%
          </p>
          <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider">Moy.</p>
        </div>
        <div className="w-px h-8 bg-border/50" />
        <div className="text-center px-2">
          <p className="text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
            {criticalRegions}
          </p>
          <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider">Critiques</p>
        </div>
      </motion.div>

      {/* Stats rapides */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center gap-2"
      >
        <Badge variant="outline" className="bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-800 gap-1.5">
          <Flame className="w-3 h-3 text-red-500" />
          <span className="font-semibold text-red-700 dark:text-red-400">{criticalRegions}</span>
          <span className="text-muted-foreground">critiques</span>
        </Badge>
        <Badge variant="outline" className="bg-orange-50/50 border-orange-200/50 dark:bg-orange-950/20 dark:border-orange-800 gap-1.5">
          <TrendingUp className="w-3 h-3 text-orange-500" />
          <span className="font-semibold text-orange-700 dark:text-orange-400">{highDemandRegions}</span>
          <span className="text-muted-foreground">élevées</span>
        </Badge>
        <Badge variant="outline" className="bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800 gap-1.5">
          <Users className="w-3 h-3 text-blue-500" />
          <span className="font-semibold text-blue-700 dark:text-blue-400">{totalDonors}</span>
          <span className="text-muted-foreground">donneurs</span>
        </Badge>
        {topRegion && (
          <Badge variant="outline" className="bg-primary/5 border-primary/20 gap-1.5">
            <MapIcon className="w-3 h-3 text-primary" />
            <span className="font-semibold text-primary">{topRegion.region}</span>
            <span className="text-muted-foreground">prioritaire</span>
          </Badge>
        )}
      </motion.div>
    </>
  );
}