import { Bell, Heart, Users } from "lucide-react";

export const STATUS_CONFIG = {
  VERIFIED:  { label: "Certifiée",  className: "bg-green-100 text-green-700 border-green-200" },
  PENDING:   { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  SUSPENDED: { label: "Suspendue",  className: "bg-red-100 text-red-700 border-red-200" },
  REJECTED:  { label: "Rejetée",    className: "bg-gray-100 text-gray-600 border-gray-200" },
} as const;

export const STATUS_FILTERS = [
  { value: "ALL",       label: "Toutes" },
  { value: "PENDING",   label: "En attente" },
  { value: "VERIFIED",  label: "Certifiées" },
  { value: "SUSPENDED", label: "Suspendues" },
  { value: "REJECTED",  label: "Rejetées" },
];

// Configuration des gradients par statut
export const STATUS_GRADIENTS = {
  VERIFIED: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  PENDING: "from-amber-500/10 via-amber-500/5 to-transparent",
  SUSPENDED: "from-rose-500/10 via-rose-500/5 to-transparent",
  REJECTED: "from-slate-500/10 via-slate-500/5 to-transparent",
};

// Configuration des couleurs pour les métriques
export const METRIC_CONFIG = {
  staffMembers: { icon: Users, color: "from-blue-500 to-blue-600", label: "Membres" },
  alerts: { icon: Bell, color: "from-amber-500 to-amber-600", label: "Alertes" },
  donations: { icon: Heart, color: "from-rose-500 to-rose-600", label: "Dons" },
};

export const SUSPENSION_REASONS = [
  "Abus détecté — alertes infondées répétées",
  "Documents expirés ou invalides",
  "Non-conformité aux protocoles Vita-Link",
  "Signalement d'utilisateurs",
  "Autre",
];