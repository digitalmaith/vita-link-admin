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
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar.store";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vue hélicoptère",
  },
  {
    label: "Structures",
    href: "/structures",
    icon: Hospital,
    description: "Certifications",
  },
  {
    label: "Jambaars",
    href: "/jambaars",
    icon: Users,
    description: "Modération donneurs",
  },
  {
    label: "Récompenses",
    href: "/rewards",
    icon: Gift,
    description: "Régie Jambaar Life",
  },
  {
    label: "Rapports",
    href: "/reports",
    icon: BarChart3,
    description: "Statistiques & export",
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
    description: "Config système",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card sidebar-transition shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight truncate">Vita-Link</p>
            <p className="text-xs text-muted-foreground truncate">Control Room</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3 top-20 flex items-center justify-center",
          "w-6 h-6 rounded-full border border-border bg-card",
          "hover:bg-accent transition-colors z-10"
        )}
        aria-label={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
      >
        <ChevronLeft
          className={cn(
            "w-3 h-3 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}
