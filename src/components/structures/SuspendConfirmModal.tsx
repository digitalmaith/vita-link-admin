"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  structureName: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const SUSPENSION_REASONS = [
  "Abus détecté — alertes infondées répétées",
  "Documents expirés ou invalides",
  "Non-conformité aux protocoles Vita-Link",
  "Signalement d'utilisateurs",
  "Autre",
];

export function SuspendConfirmModal({
  open, structureName, onConfirm, onClose, isLoading,
}: Props) {
  const [reason, setReason] = useState(SUSPENSION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const finalReason = reason === "Autre" ? customReason : reason;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Suspendre la structure
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vous êtes sur le point de suspendre{" "}
            <span className="font-semibold text-foreground">{structureName}</span>.
            Cette action empêchera la structure d'émettre des alertes.
          </p>

          {/* Motif */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Motif de suspension</label>
            <div className="space-y-2">
              {SUSPENSION_REASONS.map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Motif personnalisé */}
          {reason === "Autre" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Décrivez le motif de suspension..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isLoading || (reason === "Autre" && !customReason.trim())}
              onClick={() => onConfirm(finalReason)}
            >
              {isLoading ? "Suspension..." : "Confirmer la suspension"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}