"use client";

import { motion } from "framer-motion";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeIcon } from "./BadgeIcon";
import type { Badge } from "@/services/badges.service";

interface BadgeFormFieldsProps {
  isEdit: boolean;
  badge?: Badge | null;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  iconUrl: string;
  setIconUrl: (value: string) => void;
  criteria: string;
  setCriteria: (value: string) => void;
  isSeasonal: boolean;
  setIsSeasonal: (value: boolean) => void;
  season: string;
  setSeason: (value: string) => void;
}

export function BadgeFormFields({
  isEdit,
  badge,
  name,
  setName,
  description,
  setDescription,
  iconUrl,
  setIconUrl,
  criteria,
  setCriteria,
  isSeasonal,
  setIsSeasonal,
  season,
  setSeason,
}: BadgeFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Aperçu en direct */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border">
        <BadgeIcon iconUrl={iconUrl} name={name} size="xl" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">{name || "Nom du badge"}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{description || "Description du badge"}</p>
          {isSeasonal && season && (
            <BadgeUI variant="outline" className="mt-2 bg-purple-50 text-purple-700 border-purple-200">
              <Calendar className="w-3 h-3 mr-1" /> {season}
            </BadgeUI>
          )}
        </div>
        {isEdit && (
          <BadgeUI className={cn(
            "shrink-0",
            badge?.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
          )}>
            {badge?.isActive ? "Actif" : "Inactif"}
          </BadgeUI>
        )}
      </div>

      {/* Nom + URL icône */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nom <span className="text-destructive">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="ex: Guerrier"
            className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">URL de l'icône</label>
          <input
            type="url"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.png"
            className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <p className="text-[11px] text-muted-foreground">Laissez vide pour l'icône par défaut</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          placeholder="ex: A effectué 5 dons de sang"
          className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
        />
      </div>

      {/* Critères */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Critères (JSON) <span className="text-destructive">*</span></label>
        <input
          type="text"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          required
          placeholder='{"minDonations": 5}'
          className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs transition-all"
        />
        <p className="text-[11px] text-muted-foreground">
          Format JSON : {"{"}"minDonations": 5, "livesSaved": 3{"}"}
        </p>
      </div>

      {/* Saisonnier */}
      <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSeasonal}
            onChange={(e) => setIsSeasonal(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <div>
            <span className="text-sm font-medium">Badge saisonnier</span>
            <p className="text-xs text-muted-foreground">Ce badge est lié à un événement ou une saison spécifique</p>
          </div>
        </label>
        {isSeasonal && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="ex: Ramadan 2026"
              className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}