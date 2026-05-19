// =============================================
// VITA-LINK ADMIN — Mock Data: Jambaars
// Utilisé quand le backend n'est pas déployé
// =============================================

import type { Jambaar } from "@/types";

export const MOCK_JAMBAARS: Jambaar[] = [
  {
    id: "j-001",
    firstName: "Ousmane",
    lastName: "Diallo",
    phone: "+221 77 123 45 67",
    email: "ousmane.diallo@gmail.com",
    bloodGroup: "O+",
    region: "Dakar",
    city: "Dakar Plateau",
    grade: "AMBASSADEUR",
    status: "ACTIVE",
    points: 2450,
    totalDonations: 18,
    commitmentRate: 96,
    createdAt: "2022-03-15T08:00:00Z",
    lastDonationAt: "2024-11-20T10:30:00Z",
  },
  {
    id: "j-002",
    firstName: "Aissatou",
    lastName: "Ndiaye",
    phone: "+221 78 234 56 78",
    email: "aissatou.ndiaye@outlook.com",
    bloodGroup: "A+",
    region: "Thiès",
    city: "Thiès-Nord",
    grade: "AMBASSADEUR",
    status: "ACTIVE",
    points: 2110,
    totalDonations: 15,
    commitmentRate: 92,
    createdAt: "2022-06-01T09:00:00Z",
    lastDonationAt: "2024-10-05T14:00:00Z",
  },
  {
    id: "j-003",
    firstName: "Moussa",
    lastName: "Faye",
    phone: "+221 76 345 67 89",
    bloodGroup: "B+",
    region: "Saint-Louis",
    city: "Saint-Louis Centre",
    grade: "SENTINELLE",
    status: "ACTIVE",
    points: 1340,
    totalDonations: 9,
    commitmentRate: 88,
    createdAt: "2023-01-10T07:30:00Z",
    lastDonationAt: "2024-09-12T09:00:00Z",
  },
  {
    id: "j-004",
    firstName: "Fatou",
    lastName: "Sow",
    phone: "+221 70 456 78 90",
    email: "fatou.sow@yahoo.fr",
    bloodGroup: "AB+",
    region: "Dakar",
    city: "Guédiawaye",
    grade: "SENTINELLE",
    status: "ACTIVE",
    points: 980,
    totalDonations: 7,
    commitmentRate: 85,
    createdAt: "2023-04-22T11:00:00Z",
    lastDonationAt: "2024-08-30T16:20:00Z",
  },
  {
    id: "j-005",
    firstName: "Ibrahima",
    lastName: "Ba",
    phone: "+221 77 567 89 01",
    bloodGroup: "O-",
    region: "Kaolack",
    city: "Kaolack",
    grade: "ASPIRANT",
    status: "ACTIVE",
    points: 420,
    totalDonations: 3,
    commitmentRate: 75,
    createdAt: "2023-09-05T08:15:00Z",
    lastDonationAt: "2024-07-18T10:00:00Z",
  },
  {
    id: "j-006",
    firstName: "Mariama",
    lastName: "Diop",
    phone: "+221 78 678 90 12",
    email: "mariama.diop@gmail.com",
    bloodGroup: "A-",
    region: "Ziguinchor",
    city: "Ziguinchor",
    grade: "SENTINELLE",
    status: "SUSPENDED",
    points: 760,
    totalDonations: 6,
    commitmentRate: 60,
    createdAt: "2022-11-18T10:00:00Z",
    lastDonationAt: "2024-04-02T13:30:00Z",
  }
];

// Historiques de dons par Jambaar ID
export const MOCK_DONATION_HISTORY: Record<string, {
  id: string;
  structureName: string;
  date: string;
  status: "COMPLETED" | "CANCELLED" | "NO_SHOW";
  pointsEarned: number;
  bloodGroup: string;
}[]> = {
  "j-001": [
    { id: "d-001", structureName: "Hôpital Principal de Dakar", date: "2024-11-20T10:30:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "O+" },
    { id: "d-002", structureName: "Centre de Transfusion Sanguine de Dakar", date: "2024-08-10T09:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "O+" },
    { id: "d-003", structureName: "Hôpital Aristide Le Dantec", date: "2024-05-22T14:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "O+" },
    { id: "d-004", structureName: "Clinique du Cap", date: "2024-02-08T11:00:00Z", status: "NO_SHOW", pointsEarned: 0, bloodGroup: "O+" },
    { id: "d-005", structureName: "Hôpital Principal de Dakar", date: "2023-11-15T10:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "O+" },
  ],
  "j-002": [
    { id: "d-010", structureName: "Hôpital Régional de Thiès", date: "2024-10-05T14:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "A+" },
    { id: "d-011", structureName: "Hôpital Régional de Thiès", date: "2024-07-18T09:30:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "A+" },
    { id: "d-012", structureName: "Centre de Santé de Mbour", date: "2024-03-22T11:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "A+" },
  ],
  "j-003": [
    { id: "d-020", structureName: "Hôpital Régional de Saint-Louis", date: "2024-09-12T09:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "B+" },
    { id: "d-021", structureName: "Hôpital Régional de Saint-Louis", date: "2024-06-08T10:00:00Z", status: "CANCELLED", pointsEarned: 0, bloodGroup: "B+" },
    { id: "d-022", structureName: "Centre Hospitalier de Podor", date: "2024-02-14T08:30:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "B+" },
  ],
  "j-009": [
    { id: "d-030", structureName: "Hôpital Régional de Tambacounda", date: "2024-12-01T08:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "AB-" },
    { id: "d-031", structureName: "Hôpital Régional de Tambacounda", date: "2024-09-05T09:00:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "AB-" },
    { id: "d-032", structureName: "Centre de Santé de Kédougou", date: "2024-06-20T10:30:00Z", status: "COMPLETED", pointsEarned: 150, bloodGroup: "AB-" },
  ],
};

// Pagination helper
export function paginateMock<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
  };
}
