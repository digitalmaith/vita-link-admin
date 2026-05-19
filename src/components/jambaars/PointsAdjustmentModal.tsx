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
      // Reset state
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajuster les points</DialogTitle>
          <DialogDescription>
            Modifier le solde de points de {jambaar.firstName} {jambaar.lastName} (Actuel: {jambaar.points} pts).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="points">Points à ajouter/retirer</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value ? Number(e.target.value) : "")}
              placeholder="Ex: 50 ou -20"
            />
            <p className="text-xs text-muted-foreground">
              Utilisez un nombre négatif pour retirer des points.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Motif de l'ajustement</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Récompense manuelle, erreur système..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={adjustPoints.isPending}>
            Annuler
          </Button>
          <Button onClick={handleAdjust} disabled={adjustPoints.isPending}>
            {adjustPoints.isPending ? "Enregistrement..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
