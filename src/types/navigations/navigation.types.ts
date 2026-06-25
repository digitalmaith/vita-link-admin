import { type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

export interface SearchablePage {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  keywords: string[];
}

export interface BreadcrumbMap {
  [key: string]: string;
}

export interface Notification {
  id?: string;
  title: string;
  description: string;
  time: string;
  type: "danger" | "success" | "info" | "warning";
  read?: boolean;
}