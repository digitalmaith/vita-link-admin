"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Globe, 
  Power, 
  PowerOff, 
  Pencil,
  ExternalLink,
  Gift,
  Store,
  MapPin,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";
import type { Partner } from "@/services/rewards.service";
import { cn } from "@/lib/utils";

interface Props {
  partner: Partner;
  rewardsCount: number;
  onEdit: (p: Partner) => void;
  onToggle: (p: Partner) => void;
  onSelect: (p: Partner) => void;
}

export function PartnerCard({ partner, rewardsCount, onEdit, onToggle, onSelect }: Props) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/30",
        "hover:-translate-y-1 cursor-pointer",
        "border border-neutral-200 dark:border-neutral-800",
        "bg-white dark:bg-neutral-900/80 backdrop-blur-sm",
        !partner.isActive && "opacity-75 hover:opacity-100"
      )}
      onClick={() => onSelect(partner)}
    >
      {/* Barre d'état en haut */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        partner.isActive 
          ? "bg-emerald-500" 
          : "bg-neutral-300 dark:bg-neutral-700"
      )} />

      <CardContent className="p-5">
        {/* En-tête avec logo et actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Logo avec effet de survol */}
            <div className={cn(
              "relative w-12 h-12 rounded-xl border-2 overflow-hidden shrink-0",
              "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
              partner.isActive 
                ? "border-emerald-200 dark:border-emerald-800" 
                : "border-neutral-200 dark:border-neutral-700"
            )}>
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Indicateur de statut */}
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900",
                partner.isActive 
                  ? "bg-emerald-500" 
                  : "bg-neutral-400"
              )} />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {partner.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary"
                  className={cn(
                    "text-[10px] px-2 py-0 h-5",
                    partner.isActive 
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" 
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                  )}
                >
                  {partner.isActive ? (
                    <ShieldCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <ShieldOff className="w-3 h-3 mr-1" />
                  )}
                  {partner.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Menu d'actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(partner); }}>
                <Pencil className="mr-2 h-4 w-4" /> 
                Modifier
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onToggle(partner); }}
                className={partner.isActive ? "text-amber-600" : "text-emerald-600"}
              >
                {partner.isActive ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" /> 
                    Désactiver
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" /> 
                    Activer
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {partner.description || "Aucune description"}
        </p>

        {/* Statistiques et site web */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gift className="w-3.5 h-3.5" />
            <span className="font-medium">{rewardsCount}</span>
            <span>récompense{rewardsCount > 1 ? "s" : ""}</span>
          </div>

          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group/link"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="group-hover/link:underline">Site web</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}
        </div>
      </CardContent>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>
    </Card>
  );
}

// Version squelette pour le chargement
export function PartnerCardSkeleton() {
  return (
    <Card className="border border-neutral-200 dark:border-neutral-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}