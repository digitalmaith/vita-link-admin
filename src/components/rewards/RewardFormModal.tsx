"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Reward, Partner, CreateRewardPayload } from "@/services/rewards.service";
import { REWARD_TYPES, REWARD_TYPE_CONFIG } from "../../lib/constants/rewards.constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRewardPayload) => void;
  isLoading?: boolean;
  reward?: Reward | null;
  partners: Partner[];
}

export function RewardFormModal({ open, onClose, onSubmit, isLoading, reward, partners }: Props) {
  const isEdit = !!reward;

  const [partnerId, setPartnerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState(100);
  const [rewardType, setRewardType] = useState<CreateRewardPayload["rewardType"]>("DISCOUNT_COUPON");
  const [stockQuantity, setStockQuantity] = useState(10);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (reward) {
      setPartnerId(reward.partner.id);
      setTitle(reward.title);
      setDescription(reward.description);
      setPointsCost(reward.pointsCost);
      setRewardType(reward.rewardType);
      setStockQuantity(reward.stockQuantity);
      setIsUnlimited(reward.isUnlimited);
      setExpiresAt(reward.expiresAt ? reward.expiresAt.slice(0, 16) : "");
    } else {
      setPartnerId(partners[0]?.id ?? "");
      setTitle("");
      setDescription("");
      setPointsCost(100);
      setRewardType("DISCOUNT_COUPON");
      setStockQuantity(10);
      setIsUnlimited(false);
      setExpiresAt("");
    }
  }, [reward, open, partners]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      partnerId,
      title,
      description,
      pointsCost,
      rewardType,
      stockQuantity,
      isUnlimited,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
  };

  const isDisabled = isLoading || !title.trim() || !description.trim() || !partnerId;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier la récompense" : "Ajouter une récompense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Partenaire */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Partenaire <span className="text-destructive">*</span>
            </label>
            <select
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sélectionner un partenaire</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Titre <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Ticket de bus gratuit"
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
              placeholder="ex: Valable 1 trajet sur la ligne Dakar-Diamniadio"
              required
              rows={2}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type de récompense</label>
            <select
              value={rewardType}
              onChange={(e) => setRewardType(e.target.value as CreateRewardPayload["rewardType"])}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {REWARD_TYPES.map((t) => (
                <option key={t} value={t}>{REWARD_TYPE_CONFIG[t].label}</option>
              ))}
            </select>
          </div>

          {/* Points */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Coût en points</label>
            <input
              type="number"
              value={pointsCost}
              onChange={(e) => setPointsCost(Number(e.target.value))}
              min={1}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Stock</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUnlimited}
                onChange={(e) => setIsUnlimited(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-sm">Stock illimité</span>
            </label>
            {!isUnlimited && (
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                min={0}
                placeholder="Quantité disponible"
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>

          {/* Date d'expiration */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date d'expiration</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
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