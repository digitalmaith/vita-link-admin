"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Map as MapIcon, Droplets, Users, Heart, AlertTriangle, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/types";
import { getDemandInfo, getDemandColor } from "./heatmap-utils";

interface RegionDetailModalProps {
  region: RegionStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegionDetailModal({ region, open, onOpenChange }: RegionDetailModalProps) {
  if (!region) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* En-tête du modal avec gradient */}
        <div className={cn("relative p-6 text-white", getDemandColor(region.demandLevel))}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />   
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{region.region}</DialogTitle>
              <p className="text-sm opacity-80">{getDemandInfo(region.demandLevel).description}</p>
            </div>
          </div>

          {/* Niveau de demande */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-black">
                {region.demandLevel}
                <span className="text-2xl">%</span>
              </p>
              <p className="text-sm opacity-80 mt-1">Niveau de demande</p>
            </div>
            <Badge className="px-3 py-1.5 text-sm font-bold bg-red/20 text-white">
              {getDemandInfo(region.demandLevel).label}
            </Badge>
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 space-y-6">
          {/* Barre de progression */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression de la demande</span>
              <span className="text-sm font-bold">{region.demandLevel}%</span>
            </div>
            <Progress value={region.demandLevel} className="h-2" />
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Droplets className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Demande</span>
              </div>
              <p className="text-2xl font-bold">{region.demandLevel}%</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Donneurs</span>
              </div>
              <p className="text-2xl font-bold">{region.donorsCount}</p>
            </div>
          </div>

          {/* Message d'alerte */}
          {region.demandLevel >= 75 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">Alerte critique</p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                    Cette région nécessite une attention immédiate. Le niveau de demande est critique et des actions urgentes sont recommandées.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {region.demandLevel >= 50 && region.demandLevel < 75 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Surveillance recommandée</p>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">
                    La demande est élevée dans cette région. Une surveillance active est conseillée.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer du modal */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>
                {region.donorsCount > 0 ? `${region.donorsCount} donneurs disponibles` : "Aucun donneur"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}