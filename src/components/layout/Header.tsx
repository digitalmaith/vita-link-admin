"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/structures": "Structures de Santé",
  "/jambaars": "Jambaars",
  "/rewards": "Récompenses",
  "/reports": "Rapports",
  "/settings": "Paramètres",
};

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const pageTitle = BREADCRUMB_MAP[pathname] ?? "Vita-Link Admin";
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "AD";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
        <p className="text-xs text-muted-foreground">Vita-Link Admin</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" aria-label="Rechercher">
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* Badge d'alertes critiques */}
          <Badge
            className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]"
            variant="destructive"
          >
            3
          </Badge>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">
                {session?.user?.name ?? "Administrateur"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email ?? ""}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
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
