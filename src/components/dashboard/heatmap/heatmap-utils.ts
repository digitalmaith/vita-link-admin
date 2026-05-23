import { Flame, TrendingUp, TrendingDown, Activity } from "lucide-react";

export function getDemandColor(level: number): string {
  if (level >= 75) return "from-rose-600 via-red-600 to-rose-700";
  if (level >= 50) return "from-amber-500 via-orange-500 to-amber-600";
  if (level >= 25) return "from-yellow-400 via-amber-400 to-yellow-500";
  return "from-emerald-400 via-green-500 to-teal-500";
}

export function getDemandBgColor(level: number): string {
  if (level >= 75) return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
  if (level >= 50) return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800";
  if (level >= 25) return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800";
  return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800";
}

export function getDemandTextColor(level: number): string {
  if (level >= 75) return "text-red-700 dark:text-red-400";
  if (level >= 50) return "text-orange-700 dark:text-orange-400";
  if (level >= 25) return "text-amber-700 dark:text-amber-400";
  return "text-emerald-700 dark:text-emerald-400";
}

export function getDemandInfo(level: number) {
  if (level >= 75)
    return { icon: Flame, label: "Critique", description: "Besoin urgent de donneurs" };
  if (level >= 50)
    return { icon: TrendingUp, label: "Élevée", description: "Forte demande en cours" };
  if (level >= 25)
    return { icon: Activity, label: "Modérée", description: "Demande stable" };
  return { icon: TrendingDown, label: "Faible", description: "Situation normale" };
}