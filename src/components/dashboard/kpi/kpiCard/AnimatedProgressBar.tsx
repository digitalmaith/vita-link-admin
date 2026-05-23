"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  accent: string;
  isHovered: boolean;
  defaultValue?: number;
}

export function AnimatedProgressBar({ 
  accent, 
  isHovered, 
  defaultValue = 75 
}: AnimatedProgressBarProps) {
  return (
    <div className="relative w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      {/* Barre de fond avec motif */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-shimmer" />

      {/* Barre de progression */}
      <motion.div
        className={cn(
          "relative h-full rounded-full",
          accent,
          "opacity-40 dark:opacity-60"
        )}
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : `${defaultValue}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* Effet de brillance */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Point lumineux à la fin */}
        <motion.div
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
            accent,
            "shadow-lg"
          )}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}