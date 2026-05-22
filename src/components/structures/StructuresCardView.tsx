"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, CheckCircle, XCircle, PauseCircle,
  Users, Bell, Heart, MapPin, Phone, Building2,
  Mail, Calendar, TrendingUp, Shield, Star, Sparkles,
  ExternalLink, Eye
} from "lucide-react";
import { StructureStatusBadge } from "./StructureStatusBadge";
import type { HealthStructure } from "@/services/structures.service";
import { formatDate } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { STATUS_GRADIENTS , METRIC_CONFIG} from "@/lib/constants/structures.constants";
import {MetricBadge} from "./MetricBadge";
import { cn } from "@/lib/utils";

interface Props {
  structures: HealthStructure[];
  onSelect: (s: HealthStructure) => void;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
}






export function StructuresCardView({ structures, onSelect, onVerify, onSuspend, onReject }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (structures.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-2xl" />
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30 relative" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-1">Aucune structure trouvée</h3>
        <p className="text-sm text-muted-foreground/70">Ajustez vos filtres ou créez une nouvelle structure</p>
      </motion.div>
    );
  }

  // Calcul des statistiques pour le header
  const totalStaff = structures.reduce((acc, s) => acc + s._count.staffMembers, 0);
  const totalDonations = structures.reduce((acc, s) => acc + s._count.donations, 0);
  const verifiedCount = structures.filter(s => s.status === "VERIFIED").length;

  return (
    <div className="space-y-6">
      {/* Mini stats header */}
      <div className="grid grid-cols-3 gap-3 px-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/20 dark:to-transparent border border-blue-200/50 dark:border-blue-800/30 hover:shadow-md transition-all duration-200 group"
        >
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs text-muted-foreground">Membres totaux</p>
            <p className="text-lg font-bold leading-none">{totalStaff}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-rose-50 to-rose-50/30 dark:from-rose-950/20 dark:to-transparent border border-rose-200/50 dark:border-rose-800/30 hover:shadow-md transition-all duration-200 group"
        >
          <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs text-muted-foreground">Dons reçus</p>
            <p className="text-lg font-bold leading-none">{totalDonations}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/20 dark:to-transparent border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-md transition-all duration-200 group"
        >
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="text-xs text-muted-foreground">Certifiées</p>
            <p className="text-lg font-bold leading-none">{verifiedCount}</p>
          </div>
        </motion.div>
      </div>

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {structures.map((s, index) => {
            const isHovered = hoveredId === s.id;
            const gradient = STATUS_GRADIENTS[s.status as keyof typeof STATUS_GRADIENTS] || STATUS_GRADIENTS.PENDING_REVIEW;
            
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onHoverStart={() => setHoveredId(s.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ y: -4 }}
              >
                <Card 
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 cursor-pointer border-border/50",
                    "hover:shadow-xl hover:border-primary/20",
                    isHovered && "shadow-lg"
                  )}
                  onClick={() => onSelect(s)}
                >
                  {/* Gradient de fond au hover */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 pointer-events-none",
                    gradient,
                    isHovered && "opacity-100"
                  )} />
                  
                  {/* Pattern décoratif */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                    </svg>
                  </div>

                  <CardContent className="p-5 relative z-10">
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 transition-all duration-300 group-hover:shadow-md">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          {s.status === "VERIFIED" && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1"
                            >
                              <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                            </motion.div>
                          )}
                        </motion.div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">{s.name}</p>
                            {s._count.donations > 50 && (
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{s.registrationNumber}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-8 w-8 shrink-0 transition-all duration-300",
                              "opacity-0 group-hover:opacity-100",
                              isHovered && "opacity-100"
                            )}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(s); }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Page publique
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {s.status === "PENDING_REVIEW" && (
                            <>
                              <DropdownMenuItem 
                                className="text-emerald-600 dark:text-emerald-400"
                                onClick={(e) => { e.stopPropagation(); onVerify(s.id); }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Certifier la structure
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => { e.stopPropagation(); onReject(s.id); }}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Rejeter la demande
                              </DropdownMenuItem>
                            </>
                          )}
                          {s.status === "VERIFIED" && (
                            <DropdownMenuItem 
                              className="text-amber-600 dark:text-amber-400"
                              onClick={(e) => { e.stopPropagation(); onSuspend(s.id); }}
                            >
                              <PauseCircle className="mr-2 h-4 w-4" />
                              Suspendre
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground group/address">
                        <MapPin className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/address:scale-110" />
                        <span className="truncate">{s.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{s.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Inscrite le {formatDate(s.createdAt)}</span>
                      </div>
                    </div>

                    {/* Footer avec statut et métriques */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <StructureStatusBadge status={s.status} />
                      <div className="flex items-center gap-2">
                        <MetricBadge value={s._count.staffMembers} config={METRIC_CONFIG.staffMembers} />
                        {s._count.alerts > 0 && (
                          <MetricBadge value={s._count.alerts} config={METRIC_CONFIG.alerts} />
                        )}
                        <MetricBadge value={s._count.donations} config={METRIC_CONFIG.donations} />
                      </div>
                    </div>

                    {/* Indicateur de performance */}
                    {s._count.donations > 100 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute bottom-2 right-2"
                      >
                        <Badge variant="secondary" className="gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/30 hover:bg-emerald-500/20 transition-colors">
                          <TrendingUp className="w-2.5 h-2.5" />
                          Top performer
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}