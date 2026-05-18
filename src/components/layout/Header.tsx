"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  HelpCircle,
  Shield,
  Menu,
  Command,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "../shared/Toggle";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/structures": "Structures de Santé",
  "/jambaars": "Donneurs Jambaars",
  "/rewards": "Récompenses",
  "/reports": "Rapports",
  "/settings": "Paramètres",
};

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const pageTitle = BREADCRUMB_MAP[pathname] ?? "Vita-Link Admin";
  
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "AD";

  const userName = session?.user?.name ?? "Administrateur";
  const userEmail = session?.user?.email ?? "admin@vita-link.sn";
  const userRole = (session?.user as any)?.role ?? "Super Admin";

  return (
    <header className={cn(
      "flex items-center justify-between px-4 lg:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        {/* Page Title */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground">
              Vita-Link Sénégal
            </p>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              En ligne
            </p>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden">
          <h1 className="text-base font-bold text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5">
        {/* Search Bar */}
        <div className={cn(
          "transition-all duration-300",
          isSearchOpen 
            ? "w-64 opacity-100" 
            : "w-0 opacity-0 overflow-hidden"
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 pr-8 h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              autoFocus={isSearchOpen}
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search Toggle */}
        {!isSearchOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Rechercher"
          >
            <Search className="w-4 h-4" />
          </Button>
        )}

        {/* Theme Toggle */}
        <ModeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <Badge
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 p-0 flex items-center justify-center text-[9px] font-bold border-2 border-white dark:border-neutral-950"
                variant="destructive"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-[10px]">3 nouvelles</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {[
                { 
                  title: "Stock critique - Dakar",
                  description: "Niveau de stock sanguin en dessous du seuil",
                  time: "Il y a 5 min",
                  type: "danger"
                },
                { 
                  title: "Nouveau donneur validé",
                  description: "Amadou Diallo a été certifié Jambaar",
                  time: "Il y a 12 min",
                  type: "success"
                },
                { 
                  title: "Rapport mensuel disponible",
                  description: "Le rapport de juin est prêt à être consulté",
                  time: "Il y a 1h",
                  type: "info"
                },
              ].map((notification, index) => (
                <DropdownMenuItem key={index} className="flex items-start gap-3 p-3 cursor-pointer">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    notification.type === "danger" && "bg-red-500",
                    notification.type === "success" && "bg-emerald-500",
                    notification.type === "info" && "bg-blue-500",
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 h-9 px-2 ml-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Avatar className="h-8 w-8 ring-2 ring-neutral-200 dark:ring-neutral-700">
                <AvatarImage src={""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-red-600 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex items-center gap-1.5">
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {userName}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {userRole}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User Info */}
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold truncate">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-[10px]">
                  <Shield className="w-3 h-3 mr-1" />
                  {userRole}
                </Badge>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Menu Items */}
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Aide & Support
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// Version simplifiée pour les pages secondaires
export function HeaderSimple({ title }: { title: string }) {
  const pathname = usePathname();
  const pageTitle = title || BREADCRUMB_MAP[pathname] || "Vita-Link Admin";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div>
        <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}