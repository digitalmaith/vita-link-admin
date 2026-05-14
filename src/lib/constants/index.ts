// =============================================
// VITA-LINK ADMIN — Business Constants
// =============================================

import type { BloodGroup, Region } from "@/types";

export const BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

export const REGIONS: Region[] = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Ziguinchor",
  "Kaolack",
  "Fatick",
  "Kolda",
  "Tambacounda",
  "Louga",
  "Diourbel",
  "Kaffrine",
  "Kédougou",
  "Matam",
  "Sédhiou",
];

export const JAMBAAR_GRADES = [
  { value: "RECRUE", label: "Recrue", minDonations: 0 },
  { value: "JAMBAAR", label: "Jambaar", minDonations: 3 },
  { value: "JAMBAAR_ELITE", label: "Jambaar Élite", minDonations: 10 },
  { value: "CHAMPION", label: "Champion", minDonations: 25 },
] as const;

export const PARTNER_CATEGORIES = [
  { value: "TELECOM", label: "Télécom" },
  { value: "RETAIL", label: "Grande distribution" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "HEALTH", label: "Santé" },
  { value: "FOOD", label: "Alimentation" },
  { value: "OTHER", label: "Autre" },
] as const;

export const PAGINATION_LIMIT = 20;

export const SENEGAL_CENTER = {
  latitude: 14.4974,
  longitude: -14.4524,
  zoom: 6,
};
