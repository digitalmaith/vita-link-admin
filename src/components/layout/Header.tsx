"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Components UI
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
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/shared/Toggle";

// Constants & Types
import { BREADCRUMB_MAP, NOTIFICATIONS } from "@/lib/constants/navigation";
import type { Notification } from "@/types/navigations";

// Hooks
import { useSearch, useKeyboardShortcuts } from "@/hooks/navigations";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  // États
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [notifications] = useState<Notification[]>(NOTIFICATIONS);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Hook de recherche
  const { searchQuery, setSearchQuery, results, clearSearch } = useSearch();

  // Raccourcis clavier
  useKeyboardShortcuts({
    isSearchOpen,
    onSearchOpen: () => {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    },
    onSearchClose: () => {
      setIsSearchOpen(false);
      clearSearch();
      setSelectedIndex(-1);
    },
    onArrowDown: () => {
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    },
    onArrowUp: () => {
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    },
    onEnter: () => {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSearchSelect(results[selectedIndex].href);
      }
    },
  });

  // Fermer la recherche au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        clearSearch();
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  // Gestion de la sélection d'un résultat
  const handleSearchSelect = (href: string) => {
    router.push(href);
    setIsSearchOpen(false);
    clearSearch();
    setSelectedIndex(-1);
  };

  // Infos utilisateur
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 lg:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0",
        className
      )}
    >
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
            <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground">Vita-Link Sénégal</p>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              En ligne
            </p>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden">
          <h1 className="text-base font-bold text-foreground">{pageTitle}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5">
        {/* Search Container */}
        <div ref={searchContainerRef} className="relative flex items-center">
          {/* Search Bar */}
          <div
            className={cn(
              "flex items-center transition-all duration-300 overflow-hidden",
              isSearchOpen ? "w-64 md:w-80 opacity-100 ml-0" : "w-0 opacity-0 -ml-4"
            )}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Rechercher... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus-visible:ring-2 focus-visible:ring-primary"
                autoFocus={isSearchOpen}
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  clearSearch();
                  setSelectedIndex(-1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Search Results */}
            {isSearchOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-1.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {results.length} résultat{results.length > 1 ? "s" : ""}
                  </div>
                  {results.map((result, index) => {
                    const Icon = result.icon;
                    const isSelected = index === selectedIndex;
                    const isActive = pathname === result.href;

                    return (
                      <button
                        key={result.href}
                        onClick={() => handleSearchSelect(result.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                          isSelected && "bg-neutral-100 dark:bg-neutral-800",
                          isActive && "bg-primary/5 dark:bg-primary/10"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg",
                            isActive ? "bg-primary/10" : "bg-neutral-100 dark:bg-neutral-800"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isActive && "text-primary"
                              )}
                            >
                              {result.label}
                            </span>
                            {isActive && (
                              <Badge variant="default" className="text-[8px] px-1.5 py-0">
                                Actuel
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-all",
                            isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aucun résultat */}
            {isSearchOpen && searchQuery.trim().length > 0 && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Aucun résultat trouvé</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search Toggle */}
          <div className="flex items-center">
            {!isSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="text-muted-foreground hover:text-foreground h-9 w-9"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground h-9 w-9"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 p-0 flex items-center justify-center text-[9px] font-bold border-2 border-white dark:border-neutral-950"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        notification.type === "danger" && "bg-red-500",
                        notification.type === "success" && "bg-emerald-500",
                        notification.type === "info" && "bg-blue-500",
                        notification.type === "warning" && "bg-amber-500"
                      )}
                    />
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
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Aucune notification
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </>
            )}
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
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
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