"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TrendConfig } from "./kpi-utils";

interface TrendBadgeProps {
  trendConfig: TrendConfig;
  trendValue: string;
}

export function TrendBadge({ trendConfig, trendValue }: TrendBadgeProps) {
  const TrendIcon = trendConfig.icon;
  const isPositive = trendValue.startsWith('+');

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold",
        "bg-neutral-50 dark:bg-neutral-800/80",
        "border border-neutral-200 dark:border-neutral-700",
        "backdrop-blur-sm",
        "shadow-sm hover:shadow-md transition-all duration-300"
      )}
    >
      <motion.div
        animate={{ rotate: isPositive ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <TrendIcon className={cn("w-4 h-4", trendConfig.color)} />
      </motion.div>
      <span className={cn("font-bold", trendConfig.color)}>{trendValue}</span>
    </motion.div>
  );
}