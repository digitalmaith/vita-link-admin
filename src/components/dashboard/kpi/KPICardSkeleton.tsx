"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KPICardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-neutral-200/80 dark:border-neutral-800/80">
      {/* Effet de shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5" />
      
      <CardContent className="p-6 space-y-5">
        {/* En-tête avec icône et badge */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
        </div>

        {/* Valeur et titre */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Description et barre de progression */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-2 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}