"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hospital,
  Users,
  Gift,
  BarChart3,
  Settings,
  ChevronLeft,
  Droplet,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";
import { useState } from "react";

// ✅ Ajouter le type pour les items de navigation
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string; // ✅ Rendre badge optionnel
}

const NAV_ITEMS: NavItem[] = [
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
    // Pas de badge
  },
  {
    label: "Donneurs",
    href: "/jambaars",
    icon: Users,
    description: "Gestion des Jambaars",
    badge: "156",
  },
  {
    label: "Récompenses",
    href: "/rewards",
    icon: Gift,
    description: "Programme fidélité",
    // Pas de badge
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: BarChart3,
    description: "Statistiques & exports",
    // Pas de badge
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Configuration",
    // Pas de badge
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: "Aide & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Centre d'aide",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 shrink-0",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b border-neutral-200 dark:border-neutral-800",
        isCollapsed && "justify-center px-2"
      )}>
        <div className="relative">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-500/20">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-950" />
        </div>
        
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="font-bold text-base leading-tight text-foreground">
              Vita-Link
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {/* Menu Section Title */}
        {!isCollapsed && (
          <div className="px-3 mb-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Menu Principal
            </p>
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                isActive
                  ? "bg-primary/10 dark:bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10" 
                  : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700",
                isCollapsed && "w-10 h-10"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="truncate block">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground/70 truncate block">
                    {item.description}
                  </span>
                </div>
              )}

              {/* ✅ Badge - Vérification TypeScript OK maintenant */}
              {!isCollapsed && item.badge && (
                <span className={cn(
                  "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-neutral-200 dark:bg-neutral-700 text-muted-foreground"
                )}>
                  {item.badge}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "px-2 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800",
        isCollapsed && "px-1"
      )}>
        {/* Notifications */}
       

        {/* Help */}
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="w-4 h-4" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* User Section */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/50",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                Admin
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                admin@vita-link.sn
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3 top-[88px] flex items-center justify-center",
          "w-6 h-6 rounded-full border border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-900",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
          "shadow-sm hover:shadow-md",
          "transition-all duration-200 z-20",
          isHovered && "opacity-100",
          !isHovered && "opacity-0"
        )}
        aria-label={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}