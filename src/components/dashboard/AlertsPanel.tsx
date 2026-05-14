"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Alert } from "@/types";

const STATUS_COLORS: Record<Alert["status"], string> = {
  OPEN: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  CLOSED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<Alert["status"], string> = {
  OPEN: "Ouverte",
  IN_PROGRESS: "En cours",
  CLOSED: "Clôturée",
  CANCELLED: "Annulée",
};

export function AlertsPanel() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts", "recent"],
    queryFn: () => dashboardService.getRecentAlerts(8),
    refetchInterval: 30 * 1000,
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          Alertes récentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 px-4 pb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !alerts?.length ? (
          <p className="text-sm text-muted-foreground px-4 pb-4">
            Aucune alerte récente.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {alerts.map((alert: Alert) => (
              <li key={alert.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{alert.structureName}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.region} · Groupe {alert.bloodGroup}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[alert.status]}`}
                  >
                    {STATUS_LABELS[alert.status]}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}