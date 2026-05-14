import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — supprime les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formater un nombre avec séparateurs français
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}

/**
 * Formater une date en français
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", options ?? {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Tronquer un texte
 */
export function truncate(str: string, max = 50): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/**
 * Obtenir les initiales d'un nom
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
