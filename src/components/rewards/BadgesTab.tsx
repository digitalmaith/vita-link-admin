"use client";

import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function BadgesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" disabled>
          <Plus className="w-4 h-4" />
          Créer un badge
        </Button>
      </div>
      <div className="text-center py-16 text-muted-foreground">
        <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>Module badges — disponible prochainement.</p>
        <p className="text-xs mt-1">En attente de l'endpoint backend.</p>
      </div>
    </div>
  );
}