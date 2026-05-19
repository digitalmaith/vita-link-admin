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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Jambaar } from "@/types";

interface SuspensionModalProps {
  jambaar: Jambaar | null;
  isOpen: boolean;
  onClose: () => void;
}

const SUSPENSION_REASONS = [
  "Non-présentation répétée (Faux sauveur)",
  "Signalement par l'hôpital",
  "Comportement inapproprié",
  "Autre",
];

export function SuspensionModal({ jambaar, isOpen, onClose }: SuspensionModalProps) {
  const [reason, setReason] = useState(SUSPENSION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [durationDays, setDurationDays] = useState<number | "">("");

  const queryClient = useQueryClient();

  const suspend = useMutation({
    mutationFn: (data: { id: string; reason: string; durationDays?: number }) =>
      jambaarService.suspend(data.id, data.reason, data.durationDays),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar suspendu avec succès");
      onClose();
      // Reset state
      setReason(SUSPENSION_REASONS[0]);
      setCustomReason("");
      setDurationDays("");
    },
    onError: () => {
      toast.error("Erreur lors de la suspension du Jambaar");
    },
  });

  if (!jambaar) return null;

  const handleSuspend = () => {
    const finalReason = reason === "Autre" ? customReason : reason;
    if (!finalReason) {
      toast.error("Veuillez préciser la raison");
      return;
    }

    suspend.mutate({
      id: jambaar.id,
      reason: finalReason,
      durationDays: durationDays !== "" ? Number(durationDays) : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suspendre un Jambaar</DialogTitle>
          <DialogDescription>
            Suspendre {jambaar.firstName} {jambaar.lastName} bloquera temporairement son accès aux alertes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label>Raison de la suspension</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {SUSPENSION_REASONS.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="font-normal">
                    {r}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {reason === "Autre" && (
            <div className="grid gap-2">
              <Label htmlFor="customReason">Précisez la raison</Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Raison spécifique..."
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="duration">Durée (en jours, optionnel)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value ? Number(e.target.value) : "")}
              placeholder="Laisser vide pour une suspension définitive"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={suspend.isPending}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleSuspend} disabled={suspend.isPending}>
            {suspend.isPending ? "Suspension..." : "Confirmer la suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
