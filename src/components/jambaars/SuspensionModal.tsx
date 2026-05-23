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
import { ShieldAlert, Calendar, Loader2 } from "lucide-react";
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
      jambaarService.suspend(data.id, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar suspendu avec succès");
      onClose();
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
      <DialogContent className="sm:max-w-[440px] rounded-2xl border-border/80 overflow-hidden">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold tracking-tight">Suspendre un Jambaar</DialogTitle>
              <DialogDescription className="text-xs">
                Bloquer temporairement l'accès de {jambaar.firstName} {jambaar.lastName} aux alertes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-3">
            <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Raison de la suspension
            </Label>
            <RadioGroup value={reason} onValueChange={setReason} className="grid gap-2.5">
              {SUSPENSION_REASONS.map((r) => {
                const isSelected = reason === r;
                return (
                  <div 
                    key={r} 
                    className={`flex items-center space-x-3 border rounded-xl p-3 cursor-pointer transition-all duration-300 hover:bg-muted/40 ${
                      isSelected 
                        ? 'border-rose-500/50 bg-rose-500/[0.02] shadow-sm' 
                        : 'border-border/60 bg-transparent'
                    }`}
                  >
                    <RadioGroupItem value={r} id={r} className="text-rose-500 border-border focus-visible:ring-rose-500/20" />
                    <Label htmlFor={r} className="font-semibold text-xs sm:text-sm text-foreground cursor-pointer flex-1 select-none">
                      {r}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {reason === "Autre" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="customReason" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Précisez la raison
              </Label>
              <Input
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Indiquez une raison spécifique..."
                className="h-10 rounded-lg focus-visible:ring-rose-500/20 focus-visible:border-rose-500/60"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="duration" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              Durée (en jours, optionnel)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value ? Number(e.target.value) : "")}
              placeholder="Laisser vide pour une suspension définitive"
              className="h-10 rounded-lg focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={suspend.isPending}
            className="rounded-lg font-semibold h-10"
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSuspend} 
            disabled={suspend.isPending}
            className="rounded-lg font-semibold h-10 shadow-sm bg-rose-600 hover:bg-rose-700"
          >
            {suspend.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> En cours...
              </span>
            ) : (
              "Confirmer la suspension"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}