import {
  LayoutDashboard,
  Hospital,
  Users,
  Gift,
  BarChart3,
  Settings,
  HelpCircle,
  Award,
  CalendarDays,
} from "lucide-react";
import type { NavItem } from "@/types/navigations";

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  {
    label: "Aide & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Centre d'aide",
  },
];

export const getNavItems = (jambaarCount: number = 0): NavItem[] => [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue d'ensemble",
    badge: "New",
  },
  {
    label: "Structures",
    href: "/structures",
    icon: Hospital,
    description: "Hôpitaux & cliniques",
  },
  {
    label: "Donneurs",
    href: "/jambaars",
    icon: Users,
    description: "Gestion des Jambaars",
    badge: String(jambaarCount),
  },
  {
    label: "Récompenses",
    href: "/rewards",
    icon: Gift,
    description: "Programme fidélité",
  },
  {
    label: "Badges",
    href: "/badges",
    icon: Award,
    description: "Badges & Défis",
  },
  {
    label: "Journées de don",
    href: "/donation-days",
    icon: CalendarDays,
    description: "Gestion des journées",
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: BarChart3,
    description: "Statistiques & exports",
  },
];