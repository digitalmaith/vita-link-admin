"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import type { Partner } from "@/services/rewards.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
  partner?: Partner | null; // null = création, Partner = modification
}

export function PartnerFormModal({ open, onClose, onSubmit, isLoading, partner }: Props) {
  const isEdit = !!partner;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Pré-remplir si modification
  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setDescription(partner.description);
      setWebsiteUrl(partner.websiteUrl ?? "");
      setLogoPreview(partner.logoUrl ?? null);
    } else {
      setName("");
      setDescription("");
      setWebsiteUrl("");
      setLogoFile(null);
      setLogoPreview(null);
    }
  }, [partner, open]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (websiteUrl) formData.append("websiteUrl", websiteUrl);
    if (logoFile) formData.append("logo", logoFile);
    onSubmit(formData);
  };

  const isDisabled = isLoading || !name.trim() || !description.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le partenaire" : "Ajouter un partenaire"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Logo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-2 w-3.5 h-3.5" />
                  {logoPreview ? "Changer" : "Choisir un logo"}
                </Button>
                {logoFile && (
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setLogoPreview(partner?.logoUrl ?? null); }}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Supprimer
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Nom */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Nom <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Orange Sonatel"
              required
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Leader des télécoms au Sénégal"
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Site web */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Site web</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.example.com"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isDisabled}>
              {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {isEdit ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}