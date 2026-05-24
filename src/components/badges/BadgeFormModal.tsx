"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Loader2 } from "lucide-react";
import { BadgeFormSelect } from "./BadgeFormSelect";
import { BadgeFormFields } from "./BadgeFormFields";
import type { Badge, CreateBadgePayload } from "@/services/badges.service";
import type { PresetBadge } from "./badge-presets";

interface BadgeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBadgePayload) => void;
  isLoading?: boolean;
  badge?: Badge | null;
}

export function BadgeFormModal({ open, onClose, onSubmit, isLoading, badge }: BadgeFormModalProps) {
  const isEdit = !!badge;
  const [step, setStep] = useState<"select" | "form">(isEdit ? "form" : "select");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [criteria, setCriteria] = useState('{"minDonations": 1}');
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [season, setSeason] = useState("");

  useEffect(() => {
    if (badge) {
      setName(badge.name);
      setDescription(badge.description);
      setIconUrl(badge.iconUrl || "");
      setCriteria(badge.criteria || '{"minDonations": 1}');
      setIsSeasonal(badge.isSeasonal || false);
      setSeason(badge.season || "");
      setStep("form");
    } else if (open && !isEdit) {
      setName("");
      setDescription("");
      setIconUrl("");
      setCriteria('{"minDonations": 1}');
      setIsSeasonal(false);
      setSeason("");
      setStep("select");
    }
  }, [badge, open, isEdit]);

  const handlePresetSelect = (preset: PresetBadge) => {
    setName(preset.name);
    setDescription(preset.description);
    setIconUrl(preset.iconUrl);
    setCriteria(preset.criteria);
    setIsSeasonal(preset.isSeasonal ?? false);
    setSeason(preset.season ?? "");
    setStep("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      iconUrl: iconUrl.trim() || "",
      criteria,
      isSeasonal,
      season: isSeasonal ? season : undefined,
    });
  };

  const handleClose = () => {
    setStep(isEdit ? "form" : "select");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {isEdit ? `Modifier "${badge?.name}"` : step === "select" ? "Choisir un badge" : "Configurer le badge"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations du badge existant." : "Sélectionnez un badge prédéfini ou créez-en un personnalisé."}
          </DialogDescription>
        </DialogHeader>

        {!isEdit && step === "select" && (
          <BadgeFormSelect onSelect={handlePresetSelect} onCustom={() => setStep("form")} />
        )}

        {(step === "form" || isEdit) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <BadgeFormFields
              isEdit={isEdit}
              badge={badge}
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              iconUrl={iconUrl}
              setIconUrl={setIconUrl}
              criteria={criteria}
              setCriteria={setCriteria}
              isSeasonal={isSeasonal}
              setIsSeasonal={setIsSeasonal}
              season={season}
              setSeason={setSeason}
            />

            <div className="flex gap-2 pt-4 border-t border-border">
              {!isEdit && (
                <Button type="button" variant="outline" onClick={() => setStep("select")}>
                  ← Retour
                </Button>
              )}
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={isLoading || !name.trim() || !description.trim()}>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Enregistrer" : "Créer le badge"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}