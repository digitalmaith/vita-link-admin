"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Globe, Power, PowerOff, Pencil } from "lucide-react";
import type { Partner } from "@/services/rewards.service";
import Image from "next/image";

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
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(partner)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {partner.name[0]}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{partner.name}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                partner.isActive
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {partner.isActive ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(partner); }}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onToggle(partner); }}
                className={partner.isActive ? "text-amber-600" : "text-green-600"}
              >
                {partner.isActive
                  ? <><PowerOff className="mr-2 h-4 w-4" /> Désactiver</>
                  : <><Power className="mr-2 h-4 w-4" /> Activer</>
                }
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {partner.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{rewardsCount} récompense{rewardsCount > 1 ? "s" : ""}</span>
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Globe className="w-3 h-3" /> Site web
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}