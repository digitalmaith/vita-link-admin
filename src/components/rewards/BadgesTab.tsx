"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { badgesService, type Badge, type CreateBadgePayload } from "@/services/badges.service";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Plus, Award, PowerOff, Pencil, Loader2, 
  Trophy, Star, Heart, Shield, Zap, Gift, Sparkles,
  CheckCircle2, XCircle, Clock, Target, Calendar,
  ChevronRight, RotateCcw, Power
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ── Badges prédéfinis avec icônes variées ──────────────

const PRESET_BADGES = [
  {
    name: "Guerrier",
    description: "A effectué 5 dons de sang",
    emoji: "⚔️",
    iconUrl: "https://img.icons8.com/fluency/96/sword.png",
    criteria: '{"minDonations": 5}',
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Héros",
    description: "A effectué 10 dons de sang",
    emoji: "🦸",
    iconUrl: "https://img.icons8.com/fluency/96/superhero.png",
    criteria: '{"minDonations": 10}',
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Légende",
    description: "A effectué 25 dons de sang",
    emoji: "🌟",
    iconUrl: "https://img.icons8.com/fluency/96/prize.png",
    criteria: '{"minDonations": 25}',
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Champion",
    description: "A effectué 50 dons de sang",
    emoji: "🏆",
    iconUrl: "https://img.icons8.com/fluency/96/trophy.png",
    criteria: '{"minDonations": 50}',
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "Sauveur",
    description: "A sauvé 3 vies estimées",
    emoji: "❤️",
    iconUrl: "https://img.icons8.com/fluency/96/like.png",
    criteria: '{"livesSaved": 3}',
    color: "from-red-500 to-rose-600",
  },
  {
    name: "Ambassadeur",
    description: "A parrainé 5 donneurs",
    emoji: "🤝",
    iconUrl: "https://img.icons8.com/fluency/96/handshake.png",
    criteria: '{"referrals": 5}',
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Fidèle",
    description: "3 dons consécutifs",
    emoji: "💎",
    iconUrl: "https://img.icons8.com/fluency/96/diamond.png",
    criteria: '{"consecutiveDonations": 3}',
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Défi Ramadan",
    description: "Don effectué pendant le Ramadan",
    emoji: "🌙",
    iconUrl: "https://img.icons8.com/fluency/96/crescent-moon.png",
    criteria: '{"season": "Ramadan"}',
    isSeasonal: true,
    season: "Ramadan 2026",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Défi Tabaski",
    description: "Don effectué pendant la Tabaski",
    emoji: "⭐",
    iconUrl: "https://img.icons8.com/fluency/96/star.png",
    criteria: '{"season": "Tabaski"}',
    isSeasonal: true,
    season: "Tabaski 2026",
    color: "from-teal-500 to-green-600",
  },
];

// ── Utilitaires ───────────────────────────────────────────

function formatCriteria(criteriaJson: string): string {
  try {
    const criteria = JSON.parse(criteriaJson);
    const parts = [];
    
    if (criteria.minDonations) {
      parts.push(`${criteria.minDonations} dons`);
    }
    if (criteria.livesSaved) {
      parts.push(`${criteria.livesSaved} vies`);
    }
    if (criteria.referrals) {
      parts.push(`${criteria.referrals} parrainages`);
    }
    if (criteria.consecutiveDonations) {
      parts.push(`${criteria.consecutiveDonations} consécutifs`);
    }
    if (criteria.season) {
      parts.push(criteria.season);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Personnalisé';
  } catch {
    return 'Personnalisé';
  }
}

// ── BadgeIcon avec fallback ──────────────────────────────

function BadgeIcon({ 
  iconUrl, 
  name, 
  emoji,
  size = "md", 
  className 
}: { 
  iconUrl: string; 
  name: string; 
  emoji?: string;
  size?: "sm" | "md" | "lg" | "xl"; 
  className?: string;
}) {
  const sizes = { 
    sm: "w-8 h-8", 
    md: "w-12 h-12", 
    lg: "w-16 h-16", 
    xl: "w-20 h-20" 
  };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7", xl: "w-9 h-9" };
  const emojiSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl", xl: "text-3xl" };
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isValidUrl = iconUrl && iconUrl.startsWith('http');

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [iconUrl]);

  return (
    <div className={cn(
      "relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0",
      "ring-1 ring-primary/10",
      sizes[size],
      className
    )}>
      {isValidUrl && !imgError && (
        <>
          <img
            src={iconUrl}
            alt={name}
            className={cn(
              "w-full h-full object-contain p-1.5 transition-opacity duration-300",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className={cn(iconSizes[size], "text-primary animate-spin")} />
            </div>
          )}
        </>
      )}

      {(imgError || !isValidUrl) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {emoji ? (
            <span className={emojiSizes[size]}>{emoji}</span>
          ) : (
            <Award className={cn(iconSizes[size], "text-primary")} />
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// ── Carte Badge ──────────────────────────────────────────

function BadgeCard({ 
  badge, 
  onEdit, 
  onDeactivate, 
  onReactivate 
}: {
  badge: Badge;
  onEdit: (badge: Badge) => void;
  onDeactivate: (badge: Badge) => void;
  onReactivate: (badge: Badge) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5",
        "border-border/50 hover:border-primary/20",
        !badge.isActive && "opacity-75 hover:opacity-90"
      )}>
        {/* Fond décoratif */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        {/* Barre d'accent */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300",
          badge.isActive 
            ? "from-emerald-400 to-emerald-500" 
            : "from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
        )} />

        <CardContent className="relative p-5">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <BadgeIcon 
                iconUrl={badge.iconUrl} 
                name={badge.name} 
                size="lg"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base truncate">{badge.name}</h3>
                  {badge.isActive ? (
                    <BadgeUI className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Actif
                    </BadgeUI>
                  ) : (
                    <BadgeUI variant="secondary" className="text-[10px] shrink-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactif
                    </BadgeUI>
                  )}
                </div>
                {badge.isSeasonal && (
                  <BadgeUI variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800 text-[10px]">
                    <Calendar className="w-3 h-3 mr-1" />
                    {badge.season || "Saisonnier"}
                  </BadgeUI>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(badge)}>
                  <Pencil className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                
                {badge.isActive ? (
                  <DropdownMenuItem 
                    className="text-amber-600 focus:text-amber-600"
                    onClick={() => onDeactivate(badge)}
                  >
                    <PowerOff className="mr-2 h-4 w-4" /> Désactiver
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    className="text-emerald-600 focus:text-emerald-600"
                    onClick={() => onReactivate(badge)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Réactiver
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {badge.description}
          </p>

          {/* Stats et footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium shrink-0">Critères :</span>
              <span className="font-mono text-[10px] bg-muted/50 px-1.5 py-0.5 rounded truncate">
                {formatCriteria(badge.criteria)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
              <Clock className="w-3 h-3" />
              {formatDate(badge.createdAt)}
            </span>
          </div>

          {/* Bouton de réactivation rapide */}
          {!badge.isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-border/50"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                onClick={() => onReactivate(badge)}
              >
                <Power className="w-3.5 h-3.5" />
                Réactiver ce badge
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Formulaire Modal avec préchargement ──────────────────

function BadgeFormModal({
  open, 
  onClose, 
  onSubmit, 
  isLoading, 
  badge,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBadgePayload) => void;
  isLoading?: boolean;
  badge?: Badge | null;
}) {
  const isEdit = !!badge;
  const [step, setStep] = useState<"select" | "form">(isEdit ? "form" : "select");
  
  // États du formulaire - préchargés si modification
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [criteria, setCriteria] = useState('{"minDonations": 1}');
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [season, setSeason] = useState("");

  // Précharger les données du badge à modifier
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
      // Réinitialiser le formulaire pour une création
      setName("");
      setDescription("");
      setIconUrl("");
      setCriteria('{"minDonations": 1}');
      setIsSeasonal(false);
      setSeason("");
      setStep("select");
    }
  }, [badge, open, isEdit]);

  const handlePresetSelect = (preset: typeof PRESET_BADGES[0]) => {
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
      iconUrl: iconUrl.trim() || undefined,
      criteria,
      isSeasonal,
      season: isSeasonal ? season : undefined,
    } as CreateBadgePayload);
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
            {isEdit 
              ? "Modifiez les informations du badge existant."
              : "Sélectionnez un badge prédéfini ou créez-en un personnalisé."}
          </DialogDescription>
        </DialogHeader>

        {/* Étape 1 — Sélection (création uniquement) */}
        {!isEdit && step === "select" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {PRESET_BADGES.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border",
                    "hover:border-primary hover:shadow-lg hover:shadow-primary/5",
                    "transition-all text-left group"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center overflow-hidden",
                    "shadow-lg group-hover:shadow-xl transition-all",
                    preset.color
                  )}>
                    <img
                      src={preset.iconUrl}
                      alt={preset.name}
                      className="w-full h-full object-contain p-2 invert"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.querySelector('.fallback-emoji')?.classList.remove('hidden');
                      }}
                    />
                    <span className="fallback-emoji hidden text-2xl">{preset.emoji}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{preset.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                  {preset.isSeasonal && (
                    <BadgeUI variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                      <Calendar className="w-3 h-3 mr-1" />
                      Saisonnier
                    </BadgeUI>
                  )}
                </motion.button>
              ))}
              
              {/* Bouton Personnalisé */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("form")}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground">Personnalisé</p>
                <p className="text-xs text-muted-foreground">Créez votre propre badge</p>
              </motion.button>
            </div>
          </div>
        )}

        {/* Étape 2 — Formulaire (toujours affiché en modification) */}
        {(step === "form" || isEdit) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aperçu en direct */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border">
              <BadgeIcon iconUrl={iconUrl} name={name} size="xl" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">{name || "Nom du badge"}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{description || "Description du badge"}</p>
                {isSeasonal && season && (
                  <BadgeUI variant="outline" className="mt-2 bg-purple-50 text-purple-700 border-purple-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {season}
                  </BadgeUI>
                )}
              </div>
              {isEdit && (
                <BadgeUI className={cn(
                  "shrink-0",
                  badge?.isActive 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {badge?.isActive ? "Actif" : "Inactif"}
                </BadgeUI>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Nom <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="ex: Guerrier"
                  className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">URL de l'icône</label>
                <input 
                  type="url" 
                  value={iconUrl} 
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                />
                <p className="text-[11px] text-muted-foreground">
                  Laissez vide pour utiliser l'icône par défaut
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                rows={2}
                placeholder="ex: A effectué 5 dons de sang"
                className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Critères (JSON) <span className="text-destructive">*</span>
              </label>
              <input 
                type="text" 
                value={criteria} 
                onChange={(e) => setCriteria(e.target.value)}
                required
                placeholder='{"minDonations": 5}'
                className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs transition-all" 
              />
              <p className="text-[11px] text-muted-foreground">
                Format JSON : {"{"}"minDonations": 5, "livesSaved": 3, "referrals": 5{"}"}
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSeasonal} 
                  onChange={(e) => setIsSeasonal(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary" 
                />
                <div>
                  <span className="text-sm font-medium">Badge saisonnier</span>
                  <p className="text-xs text-muted-foreground">Ce badge est lié à un événement ou une saison spécifique</p>
                </div>
              </label>
              {isSeasonal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input 
                    type="text" 
                    value={season} 
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="ex: Ramadan 2026"
                    className="w-full px-3 py-2 text-sm border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                  />
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              {!isEdit && (
                <Button type="button" variant="outline" onClick={() => setStep("select")}>
                  ← Retour
                </Button>
              )}
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 gap-2" 
                disabled={isLoading || !name.trim() || !description.trim()}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Enregistrer les modifications" : "Créer le badge"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Page Principale ──────────────────────────────────────

export function BadgesTab() {
  const queryClient = useQueryClient();
  const [badgeToEdit, setBadgeToEdit] = useState<Badge | null | undefined>(undefined);
  const [badgeToDeactivate, setBadgeToDeactivate] = useState<Badge | null>(null);
  const [badgeToReactivate, setBadgeToReactivate] = useState<Badge | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: () => badgesService.getAll(),
  });

  // Mutation de création
  const create = useMutation({
    mutationFn: (payload: CreateBadgePayload) => badgesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge créé avec succès");
      setBadgeToEdit(undefined);
    },
    onError: (error: any) => toast.error(error?.message ?? "Erreur lors de la création"),
  });

  // Mutation de modification
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBadgePayload> }) =>
      badgesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge modifié avec succès");
      setBadgeToEdit(undefined);
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });

  // Mutation de désactivation
  const deactivate = useMutation({
    mutationFn: (id: string) => badgesService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge désactivé avec succès");
      setBadgeToDeactivate(null);
    },
    onError: () => toast.error("Erreur lors de la désactivation"),
  });

  // Mutation de réactivation
  const reactivate = useMutation({
    mutationFn: (id: string) => badgesService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge réactivé avec succès");
      setBadgeToReactivate(null);
    },
    onError: () => toast.error("Erreur lors de la réactivation"),
  });

  const badges = data?.badges ?? [];

  // Filtrer les badges
  const filteredBadges = badges.filter((badge) => {
    if (activeFilter === "active") return badge.isActive;
    if (activeFilter === "inactive") return !badge.isActive;
    return true;
  });

  const activeCount = badges.filter((b) => b.isActive).length;
  const inactiveCount = badges.filter((b) => !b.isActive).length;

  const handleSubmit = (payload: CreateBadgePayload) => {
    if (badgeToEdit) {
      // En modification, on envoie l'ID avec les données
      update.mutate({ id: badgeToEdit.id, data: payload });
    } else {
      // En création
      create.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Gestion des badges
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {badges.length} badge{badges.length > 1 ? "s" : ""} au total
            {" · "}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {activeCount} actif{activeCount > 1 ? "s" : ""}
            </span>
            {" · "}
            <span className="text-gray-500 font-medium">
              {inactiveCount} inactif{inactiveCount > 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtres rapides */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
            {[
              { key: "all", label: "Tous", count: badges.length },
              { key: "active", label: "Actifs", count: activeCount },
              { key: "inactive", label: "Inactifs", count: inactiveCount },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activeFilter === filter.key
                    ? "bg-white dark:bg-gray-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                <span className="ml-1.5 text-[10px] opacity-60">({filter.count})</span>
              </button>
            ))}
          </div>

          <Button 
            size="sm" 
            className="gap-2 shadow-lg shadow-primary/20"
            onClick={() => setBadgeToEdit(null)}
          >
            <Plus className="w-4 h-4" />
            Créer un badge
          </Button>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between pt-3 border-t">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBadges.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
            {activeFilter === "inactive" ? (
              <Power className="w-10 h-10 text-muted-foreground/30" />
            ) : (
              <Award className="w-10 h-10 text-muted-foreground/30" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {activeFilter === "inactive" 
              ? "Aucun badge inactif" 
              : activeFilter === "active"
              ? "Aucun badge actif"
              : "Aucun badge configuré"}
          </h3>
          <p className="text-sm text-muted-foreground/70 mb-6">
            {activeFilter === "all" && "Commencez par créer votre premier badge pour récompenser les donneurs."}
          </p>
          {activeFilter === "all" && (
            <Button onClick={() => setBadgeToEdit(null)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer un badge
            </Button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onEdit={setBadgeToEdit}
                onDeactivate={setBadgeToDeactivate}
                onReactivate={setBadgeToReactivate}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Modal de formulaire (création/modification) */}
      <BadgeFormModal
        open={badgeToEdit !== undefined}
        badge={badgeToEdit}
        isLoading={create.isPending || update.isPending}
        onClose={() => setBadgeToEdit(undefined)}
        onSubmit={handleSubmit}
      />

      {/* Modal de confirmation - Désactivation */}
      <ConfirmModal
        open={!!badgeToDeactivate}
        variant="warning"
        title="Désactiver le badge"
        description={
          <span>
            Vous êtes sur le point de désactiver{" "}
            <span className="font-semibold text-foreground">
              {badgeToDeactivate?.name}
            </span>
            . Ce badge ne sera plus attribué aux donneurs.
          </span>
        }
        confirmLabel="Désactiver"
        isLoading={deactivate.isPending}
        onClose={() => setBadgeToDeactivate(null)}
        onConfirm={() => {
          if (badgeToDeactivate) deactivate.mutate(badgeToDeactivate.id);
        }}
      />

      {/* Modal de confirmation - Réactivation */}
      <ConfirmModal
        open={!!badgeToReactivate}
        variant="info"
        title="Réactiver le badge"
        description={
          <span>
            Vous êtes sur le point de réactiver{" "}
            <span className="font-semibold text-foreground">
              {badgeToReactivate?.name}
            </span>
            . Ce badge pourra à nouveau être attribué aux donneurs.
          </span>
        }
        confirmLabel="Réactiver"
        isLoading={reactivate.isPending}
        onClose={() => setBadgeToReactivate(null)}
        onConfirm={() => {
          if (badgeToReactivate) reactivate.mutate(badgeToReactivate.id);
        }}
      />
    </div>
  );
}