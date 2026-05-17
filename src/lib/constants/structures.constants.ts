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