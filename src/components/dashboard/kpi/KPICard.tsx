"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VARIANT_STYLES } from "./kpi-styles";
import { getTrendConfig } from "./kpiCard/kpi-utils";
import type { KPICardProps } from "../../../types/kpi-types";

import { KPICardSkeleton } from "./kpiCard//KPICardSkeleton";
import { AnimatedValue } from "./kpiCard//AnimatedValue";
import { AnimatedProgressBar } from "./kpiCard//AnimatedProgressBar";
import { TrendBadge } from "./kpiCard//TrendBadge";
import { TrendIndicator } from "./kpiCard//TrendIndicator";

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  trend,
  trendValue,
  isLoading = false,
  onClick,
}: KPICardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const styles = VARIANT_STYLES[variant];
  const trendConfig = useMemo(() => getTrendConfig(trend), [trend]);
  const TrendIcon = trendConfig?.icon;

  if (isLoading) {
    return <KPICardSkeleton />;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        onClick={onClick}
        className={cn(
          "relative overflow-hidden group transition-all duration-500",
          "border border-neutral-200/80 dark:border-neutral-800/80",
          "hover:shadow-2xl hover:shadow-neutral-300/50 dark:hover:shadow-black/50",
          "hover:-translate-y-2",
          "bg-gradient-to-br from-white via-white to-neutral-50/50",
          "dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800/50",
          "backdrop-blur-xl",
          onClick && "cursor-pointer"
        )}
      >
        {/* Effets de fond */}
        <CardBackground styles={styles} isHovered={isHovered} />

        {/* Barre d'accent */}
        <AccentBar styles={styles} isHovered={isHovered} />

        <CardContent className="p-6">
          {/* En-tête avec icône et badge de tendance */}
          <CardHeader
            Icon={Icon}
            styles={styles}
            isHovered={isHovered}
            trendConfig={trendConfig}
            TrendIcon={TrendIcon}
            trend={trend}
            trendValue={trendValue}
          />

          {/* Valeur et titre */}
          <ValueSection value={value} title={title} styles={styles} trendConfig={trendConfig} />

          {/* Description et progression */}
          <DescriptionSection description={description} styles={styles} isHovered={isHovered} />

          {/* Indicateur de tendance */}
          <TrendSection trend={trend} trendConfig={trendConfig} isHovered={isHovered} />
        </CardContent>

        {/* Effet de bordure lumineuse */}
        <GlowBorder styles={styles} isHovered={isHovered} />
      </Card>
    </motion.div>
  );
}

// Sous-composants internes pour la structure de la carte

function CardBackground({ styles, isHovered }: { styles: any; isHovered: boolean }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${styles.accent.replace('bg-', '')}, transparent 70%)`,
          opacity: 0.05,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

function AccentBar({ styles, isHovered }: { styles: any; isHovered: boolean }) {
  return (
    <motion.div
      className={cn("absolute top-0 left-0 right-0 h-1.5", styles.accent)}
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: isHovered ? 1 : 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
    </motion.div>
  );
}

function CardHeader({ 
  Icon, styles, isHovered, trendConfig, TrendIcon, trend, trendValue 
}: { 
  Icon: any; styles: any; isHovered: boolean; 
  trendConfig: any; TrendIcon: any; trend?: string; trendValue?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-2xl",
          "transition-all duration-300",
          styles.iconBg,
          styles.glow,
          "group-hover:shadow-2xl",
        )}
      >
        <Icon className={cn(
          "w-4 h-4 transition-all duration-300",
          styles.icon,
          "group-hover:scale-110 group-hover:rotate-12"
        )} />
        <motion.div
          animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn("absolute inset-0 rounded-2xl", styles.accent, "opacity-20")}
        />
      </motion.div>

      {trend && trendValue && trendConfig && TrendIcon && (
        <Tooltip>
          <TooltipTrigger>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TrendBadge trendConfig={trendConfig} trendValue={trendValue} />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {trendConfig.label} de {trendValue} par rapport au mois dernier
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function ValueSection({ value, title, styles, trendConfig }: { 
  value: string | number; title: string; styles: any; trendConfig: any;
}) {
  return (
    <motion.div
      className=""
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <AnimatedValue value={value} className={styles.value} />
      <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
        {title}
        {trendConfig && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn("w-1.5 h-1.5 rounded-full", trendConfig.color.replace('text-', 'bg-'))}
          />
        )}
      </p>
    </motion.div>
  );
}

function DescriptionSection({ description, styles, isHovered }: { 
  description?: string; styles: any; isHovered: boolean;
}) {
  return (
    <motion.div
      className="mt-5 space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {description && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
      <AnimatedProgressBar accent={styles.accent} isHovered={isHovered} />
    </motion.div>
  );
}

function TrendSection({ trend, trendConfig, isHovered }: { 
  trend?: string; trendConfig: any; isHovered: boolean;
}) {
  return (
    <AnimatePresence>
      {trend && trendConfig && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className=" pt-3 border-t border-neutral-100 dark:border-neutral-800"
        >
          <TrendIndicator trendConfig={trendConfig} isHovered={isHovered} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GlowBorder({ styles, isHovered }: { styles: any; isHovered: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      animate={isHovered ? { opacity: [0.1, 0.2, 0.1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        background: `linear-gradient(135deg, transparent 0%, ${styles.accent.replace('bg-', '')}20 50%, transparent 100%)`,
      }}
    />
  );
}