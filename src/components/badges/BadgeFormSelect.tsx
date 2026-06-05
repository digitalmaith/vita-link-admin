"use client";

import { motion } from "framer-motion";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRESET_BADGES, type PresetBadge } from "./badge-presets";

interface BadgeFormSelectProps {
  onSelect: (preset: PresetBadge) => void;
  onCustom: () => void;
}

export function BadgeFormSelect({ onSelect, onCustom }: BadgeFormSelectProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
      {PRESET_BADGES.map((preset) => (
        <motion.button
          key={preset.name}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(preset)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border",
            "hover:border-primary hover:shadow-lg hover:shadow-primary/5",
            "transition-all text-left group"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center overflow-hidden",
            "shadow-lg group-hover:shadow-xl transition-all",
            preset.color
          )}>
            <img
              src={preset.iconUrl}
              alt={preset.name}
              className="w-full h-full object-contain p-2 invert"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.querySelector('.fallback-emoji')?.classList.remove('hidden');
              }}
            />
            <span className="fallback-emoji hidden text-2xl">{preset.emoji}</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{preset.name}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{preset.description}</p>
          </div>
          {preset.isSeasonal && (
            <BadgeUI variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
              <Calendar className="w-3 h-3 mr-1" /> Saisonnier
            </BadgeUI>
          )}
        </motion.button>
      ))}

      {/* Bouton Personnalisé */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCustom}
        className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">Personnalisé</p>
        <p className="text-xs text-muted-foreground">Créez votre propre badge</p>
      </motion.button>
    </div>
  );
}