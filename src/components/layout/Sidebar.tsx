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
  HelpCircle,
  type LucideIcon,
  Badge,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import { CalendarDays } from "lucide-react";

// Types
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: "Aide & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Centre d'aide",
  },
];

// Composant Tooltip personnalisé - Version avec positionnement individuel
const Tooltip = ({ 
  children, 
  label, 
  description,
  isCollapsed 
}: { 
  children: React.ReactNode;
  label: string;
  description?: string;
  isCollapsed: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
  }, [isVisible]);

  // Si la sidebar n'est pas réduite, on retourne juste les enfants
  if (!isCollapsed) return <>{children}</>;

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* Tooltip avec positionnement individuel */}
      {isVisible && (
        <div
          className="fixed z-[9999] transition-all duration-200"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateY(-50%)',
            opacity: 1,
          }}
        >
          <div className="relative bg-neutral-900 dark:bg-neutral-800 text-white px-3 py-2 rounded-lg shadow-xl min-w-[160px]">
            {/* Flèche */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 dark:bg-neutral-800 rotate-45" />
            
            {/* Contenu */}
            <div className="relative">
              <p className="text-sm font-semibold">{label}</p>
              {description && (
                <p className="text-xs text-neutral-300 mt-0.5">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const [isHovered, setIsHovered] = useState(false);

  // QUERY POUR COMPTER LES JAMBAARS
  const { data } = useQuery({
    queryKey: ["sidebar-jambaars-count"],
    queryFn: () =>
      jambaarService.getAll(
        {
          bloodGroup: undefined,
          search: undefined,
          grade: undefined,
        },
        1
      ),
  });

  const jambaarCount = data?.total ?? 0;

  // NAV ITEMS DYNAMIQUE
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

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 shrink-0",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-6 border-b border-neutral-200 dark:border-neutral-800",
          isCollapsed && "justify-center px-2"
        )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700">
          <Droplet className="w-5 h-5 text-white" />
        </div>

        {!isCollapsed && (
          <div>
            <p className="font-bold text-base">Vita-Link</p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Tooltip
              key={item.href}
              label={item.label}
              description={item.description}
              isCollapsed={isCollapsed}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg",
                    isActive ? "bg-primary/10" : "bg-neutral-100 dark:bg-neutral-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {item.description}
                    </span>
                  </div>
                )}

                {/* BADGE DYNAMIQUE */}
                {!isCollapsed && item.badge && (
                  <span
                    className={cn(
                      "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-neutral-200 dark:bg-neutral-700 text-muted-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-neutral-200 dark:border-neutral-800">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.href}
              label={item.label}
              description={item.description}
              isCollapsed={isCollapsed}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </Tooltip>
          );
        })}

        {/* User */}
        <Tooltip
          label="Admin"
          description="admin@vita-link.sn"
          isCollapsed={isCollapsed}
        >
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/50",
            isCollapsed && "justify-center px-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">Admin</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  admin@vita-link.sn
                </p>
              </div>
            )}

            {!isCollapsed && (
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </Tooltip>
      </div>

      {/* Toggle */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3 top-[88px] w-6 h-6 rounded-full border bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center transition-all hover:scale-110 z-10"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}