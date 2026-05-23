"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, Pencil, PowerOff, RotateCcw,
  CheckCircle2, XCircle, Clock, Target, Calendar, Power,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { formatCriteria } from "./badge-utils";
import { BadgeIcon } from "./BadgeIcon";
import type { Badge } from "@/services/badges.service";

interface BadgeCardProps {
  badge: Badge;
  onEdit: (badge: Badge) => void;
  onDeactivate: (badge: Badge) => void;
  onReactivate: (badge: Badge) => void;
}

export function BadgeCard({ badge, onEdit, onDeactivate, onReactivate }: BadgeCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5",
        "border-border/50 hover:border-primary/20",
        !badge.isActive && "opacity-75 hover:opacity-90"
      )}>
        {/* Fond décoratif */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        {/* Barre d'accent */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300",
          badge.isActive 
            ? "from-emerald-400 to-emerald-500" 
            : "from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
        )} />

        <CardContent className="relative p-5">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <BadgeIcon iconUrl={badge.iconUrl} name={badge.name} size="lg" />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base truncate">{badge.name}</h3>
                  {badge.isActive ? (
                    <BadgeUI className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Actif
                    </BadgeUI>
                  ) : (
                    <BadgeUI variant="secondary" className="text-[10px] shrink-0">
                      <XCircle className="w-3 h-3 mr-1" /> Inactif
                    </BadgeUI>
                  )}
                </div>
                {badge.isSeasonal && (
                  <BadgeUI variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800 text-[10px]">
                    <Calendar className="w-3 h-3 mr-1" />
                    {badge.season || "Saisonnier"}
                  </BadgeUI>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(badge)}>
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                {badge.isActive ? (
                  <DropdownMenuItem className="text-amber-600 focus:text-amber-600" onClick={() => onDeactivate(badge)}>
                    <PowerOff className="mr-2 h-4 w-4" /> Désactiver
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600" onClick={() => onReactivate(badge)}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Réactiver
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {badge.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium shrink-0">Critères :</span>
              <span className="font-mono text-[10px] bg-muted/50 px-1.5 py-0.5 rounded truncate">
                {formatCriteria(badge.criteria)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
              <Clock className="w-3 h-3" />
              {formatDate(badge.createdAt)}
            </span>
          </div>

          {/* Bouton de réactivation rapide */}
          {!badge.isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-border/50"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                onClick={() => onReactivate(badge)}
              >
                <Power className="w-3.5 h-3.5" />
                Réactiver ce badge
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}