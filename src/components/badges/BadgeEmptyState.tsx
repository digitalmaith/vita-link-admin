"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Power, Plus } from "lucide-react";

interface BadgeEmptyStateProps {
  filter: "all" | "active" | "inactive";
  onCreateClick: () => void;
}

export function BadgeEmptyState({ filter, onCreateClick }: BadgeEmptyStateProps) {
  const config = {
    all: { icon: Award, title: "Aucun badge configuré", description: "Commencez par créer votre premier badge pour récompenser les donneurs.", showButton: true },
    active: { icon: Award, title: "Aucun badge actif", description: "Tous les badges sont actuellement inactifs.", showButton: false },
    inactive: { icon: Power, title: "Aucun badge inactif", description: "Tous les badges sont actuellement actifs.", showButton: false },
  };

  const { icon: Icon, title, description, showButton } = config[filter];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
        <Icon className="w-10 h-10 text-muted-foreground/30" />
      </div>
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground/70 mb-6">{description}</p>
      {showButton && (
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="w-4 h-4" /> Créer un badge
        </Button>
      )}
    </motion.div>
  );
}