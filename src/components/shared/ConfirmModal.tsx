"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, XCircle } from "lucide-react";

type ConfirmVariant = "warning" | "danger" | "info";

const VARIANT_CONFIG = {
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-600",
    confirmClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  danger: {
    icon: XCircle,
    iconClass: "text-destructive",
    confirmClass: "bg-destructive hover:bg-destructive/90 text-white",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

interface ReasonConfig {
  label?: string;
  options?: string[];
  required?: boolean;
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  reasonConfig?: ReasonConfig;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "warning",
  isLoading = false,
  reasonConfig,
}: ConfirmModalProps) {
  const { icon: Icon, iconClass, confirmClass } = VARIANT_CONFIG[variant];
  const [selectedReason, setSelectedReason] = useState(reasonConfig?.options?.[0] ?? "");
  const [customReason, setCustomReason] = useState("");

  const isCustom = selectedReason === "Autre";
  const finalReason = isCustom ? customReason : selectedReason;
  const isDisabled = isLoading ||
    (reasonConfig?.required && !finalReason.trim()) ||
    (isCustom && !customReason.trim());

  const handleConfirm = () => {
    onConfirm(reasonConfig ? finalReason : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${iconClass}`}>
            <Icon className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {description}
          </div>

          {/* Motif optionnel */}
          {reasonConfig && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {reasonConfig.label ?? "Motif"}
                {reasonConfig.required && <span className="text-destructive ml-1">*</span>}
              </label>

              {reasonConfig.options ? (
                <div className="space-y-2">
                  {reasonConfig.options.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="confirm-reason"
                        value={r}
                        checked={selectedReason === r}
                        onChange={() => setSelectedReason(r)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{r}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Saisir le motif..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              )}

              {/* Zone de texte si "Autre" sélectionné */}
              {isCustom && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Décrivez le motif..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              className={`flex-1 ${confirmClass}`}
              onClick={handleConfirm}
              disabled={isDisabled}
            >
              {isLoading ? "En cours..." : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}