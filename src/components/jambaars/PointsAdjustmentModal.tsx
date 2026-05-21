"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Award, Sparkles, Loader2 } from "lucide-react";
import type { Jambaar } from "@/types";

interface PointsAdjustmentModalProps {
  jambaar: Jambaar | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PointsAdjustmentModal({ jambaar, isOpen, onClose }: PointsAdjustmentModalProps) {
  const [points, setPoints] = useState<number | "">("");
  const [reason, setReason] = useState("");

  const queryClient = useQueryClient();

  const adjustPoints = useMutation({
    mutationFn: (data: { id: string; points: number; reason: string }) =>
      jambaarService.adjustPoints(data.id, data.points, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Points ajustés avec succès");
      onClose();
      setPoints("");
      setReason("");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajustement des points");
    },
  });

  if (!jambaar) return null;

  const handleAdjust = () => {
    if (points === "" || points === 0) {
      toast.error("Veuillez entrer un nombre de points valide (positif ou négatif)");
      return;
    }
    if (!reason) {
      toast.error("Veuillez préciser le motif de l'ajustement");
      return;
    }

    adjustPoints.mutate({
      id: jambaar.id,
      points: Number(points),
      reason,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border/80">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold tracking-tight">Ajuster les points</DialogTitle>
              <DialogDescription className="text-xs">
                Modifier le solde de points de {jambaar.firstName} {jambaar.lastName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Solde actuel mis en valeur */}
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 flex justify-between items-center">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Solde actuel</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4 fill-amber-500/10" />
              {jambaar.points} pts
            </span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Points à ajouter / retirer
            </Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value ? Number(e.target.value) : "")}
              placeholder="Ex: 50 ou -20"
              className="h-10 rounded-lg focus-visible:ring-primary/20 focus-visible:border-primary"
            />
            <p className="text-[11px] font-semibold text-muted-foreground/80 mt-0.5">
              💡 Utilisez un nombre négatif pour retirer des points.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Motif de l'ajustement
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Récompense manuelle, erreur système..."
              className="h-10 rounded-lg focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={adjustPoints.isPending}
            className="rounded-lg font-semibold h-10"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAdjust} 
            disabled={adjustPoints.isPending}
            className="rounded-lg font-semibold h-10 shadow-sm"
          >
            {adjustPoints.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
              </span>
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}