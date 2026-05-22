"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TrendConfig } from "./kpi-utils";

interface TrendIndicatorProps {
  trendConfig: TrendConfig;
  isHovered: boolean;
}

export function TrendIndicator({ trendConfig, isHovered }: TrendIndicatorProps) {
  const isPositive = 
    trendConfig.color.includes('green') || 
    trendConfig.color.includes('emerald') ||
    trendConfig.label.toLowerCase().includes('hausse');

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.div
          animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={cn(
            "w-2 h-2 rounded-full",
            trendConfig.color.replace('text-', 'bg-'),
            "shadow-sm"
          )}
        />
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {trendConfig.label}
        </span>
      </div>

      {/* Mini graphique tendance */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 3, 5, 4, 6].map((height, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: height * 2 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              type: "spring",
              stiffness: 200,
            }}
            className={cn(
              "w-1 rounded-full",
              isPositive
                ? "bg-green-400 dark:bg-green-600"
                : "bg-red-400 dark:bg-red-600"
            )}
          />
        ))}
      </div>
    </div>
  );
}