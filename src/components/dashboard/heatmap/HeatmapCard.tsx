"use client";

import { motion } from "framer-motion";
import { Building2, Users, ArrowUpRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/types";
import { getDemandInfo, getDemandBgColor, getDemandTextColor } from "./heatmap-utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  }),
  hover: {
    scale: 1.03,
    y: -6,
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
    transition: { duration: 0.2, type: "spring" as const, stiffness: 300 },
  },
  tap: { scale: 0.97 },
};

interface HeatmapCardProps {
  region: string;
  regionStat?: RegionStats;
  index: number;
  onClick: (stat: RegionStats) => void;
}

export function HeatmapCard({ region, regionStat, index, onClick }: HeatmapCardProps) {
  const level = regionStat?.demandLevel ?? 0;
  const donors = regionStat?.donorsCount ?? 0;
  const DemandIcon = getDemandInfo(level).icon;
  const demandInfo = getDemandInfo(level);
  const bgClass = getDemandBgColor(level);
  const textClass = getDemandTextColor(level);

  const getProgressColor = (level: number) => {
    if (level >= 75) return "from-red-500 to-rose-500";
    if (level >= 50) return "from-amber-500 to-orange-500";
    if (level >= 25) return "from-yellow-400 to-amber-500";
    return "from-emerald-400 to-green-500";
  };

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
      onClick={() => regionStat && onClick(regionStat)}
      className="relative group cursor-pointer"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-4 transition-all duration-300",
          "border-2 backdrop-blur-sm",
          bgClass,
          "hover:shadow-xl"
        )}
      >
        {/* Effet de verre */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-50" />

        {/* Pattern de fond subtil */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />

        {/* Contenu */}
        <div className="relative z-10">
          {/* En-tête de la carte */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-current opacity-70" />
              <p className="text-xs font-bold truncate max-w-[90px]">{region}</p>
            </div>
            <DemandIcon className={cn("w-4 h-4", textClass, "transition-transform group-hover:scale-110")} />
          </div>

          {/* Niveau de demande */}
          <div className="mb-3">
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-black leading-none">{level}</p>
              <p className="text-sm font-semibold opacity-70">%</p>
            </div>
            <p className="text-[11px] font-medium opacity-80 mt-0.5">{demandInfo.label}</p>
          </div>

          {/* Barre de progression */}
          <div className="relative h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
              className={cn("h-full rounded-full bg-gradient-to-r", getProgressColor(level))}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          </div>

          {/* Stats supplémentaires */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 opacity-60" />
              <span className="text-xs font-semibold opacity-80">{donors}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Détails</span>
            </div>
          </div>
        </div>

        {/* Badge critique */}
        {level >= 75 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
            className="absolute -top-2 -right-2"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
            </div>
          </motion.div>
        )}

        {/* Indicateur de clic */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}