import {
  Command,
  Hospital,
  Users,
  Gift,
  BarChart3,
  Settings,
  Award,
  CalendarDays,
} from "lucide-react";
import type { SearchablePage } from "@/types/navigations";

export const SEARCHABLE_PAGES: SearchablePage[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Command,
    description: "Vue d'ensemble de l'administration",
    keywords: ["accueil", "home", "tableau de bord", "statistiques"],
  },
  {
    label: "Structures",
    href: "/structures",
    icon: Hospital,
    description: "Hôpitaux & cliniques partenaires",
    keywords: ["hôpital", "clinique", "centre de santé", "établissement", "médical"],
  },
  {
    label: "Donneurs",
    href: "/jambaars",
    icon: Users,
    description: "Gestion des donneurs Jambaars",
    keywords: ["donneur", "sang", "jambaar", "don", "volontaire"],
  },
  {
    label: "Récompenses",
    href: "/rewards",
    icon: Gift,
    description: "Programme de fidélité",
    keywords: ["gift", "prime", "avantage", "bonus", "récompense"],
  },
  {
    label: "Badges",
    href: "/badges",
    icon: Award,
    description: "Badges & Défis",
    keywords: ["badge", "défi", "accomplissement", "trophée"],
  },
  {
    label: "Journées de don",
    href: "/donation-days",
    icon: CalendarDays,
    description: "Gestion des journées de collecte",
    keywords: ["collecte", "journée", "campagne", "mobilisation"],
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: BarChart3,
    description: "Statistiques & exports",
    keywords: ["statistiques", "export", "analyse", "données", "graphique"],
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Configuration de l'application",
    keywords: ["configuration", "préférences", "réglages", "profil"],
  },
];

export const NOTIFICATIONS = [
  { 
    title: "Stock critique - Dakar",
    description: "Niveau de stock sanguin en dessous du seuil",
    time: "Il y a 5 min",
    type: "danger" as const,
  },
  { 
    title: "Nouveau donneur validé",
    description: "Amadou Diallo a été certifié Jambaar",
    time: "Il y a 12 min",
    type: "success" as const,
  },
  { 
    title: "Rapport mensuel disponible",
    description: "Le rapport de juin est prêt à être consulté",
    time: "Il y a 1h",
    type: "info" as const,
  },
];