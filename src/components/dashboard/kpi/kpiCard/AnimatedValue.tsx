"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedValueProps {
  value: string | number;
  className?: string;
}

export function AnimatedValue({ value, className }: AnimatedValueProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const suffix = typeof value === 'string' ? value.replace(/[\d.,]/g, '') : '';

  return (
    <div className="relative">
      <motion.p
        key={value}
        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={cn(
          "text-2xl font-bold tracking-tight tabular-nums",
          className
        )}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {!isNaN(numericValue) ? (
            <span>{numericValue.toLocaleString()}</span>
          ) : (
            value
          )}
          {suffix && (
            <span className="text-lg ml-1 opacity-70">{suffix}</span>
          )}
        </motion.span>
      </motion.p>

      {/* Effet de reflet */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}