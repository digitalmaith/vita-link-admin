"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { TrendingUp, BarChart3 } from "lucide-react";

const YEARS = [2024, 2025, 2026];

export function DonationTrendChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: dashboardData, isLoading: kpisLoading } = useDashboardKPIs();
  const kpis = dashboardData?.kpis;

  const { data, isLoading } = useQuery({
    queryKey: ["stats", "monthly", year],
    queryFn: () => dashboardService.getMonthlyStats(year),
  });

  const chartData = data?.data ?? [];

  const summaryData = [
    { label: "Jambaars", value: kpis?.totalDonors ?? 0, color: "#C0392B" },
    { label: "Structures", value: kpis?.totalStructures ?? 0, color: "#2980B9" },
    { label: "Dons", value: kpis?.totalDonations ?? 0, color: "#16A34A" },
    { label: "Alertes", value: kpis?.totalAlerts ?? 0, color: "#D97706" },
    { label: "Vies sauvées", value: kpis?.livesSavedEstimate ?? 0, color: "#8B5CF6" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Graphique 1 — Résumé en temps réel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Vue d'ensemble — Données en temps réel
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Basé sur les données live de l'API
          </p>
        </CardHeader>
        <CardContent>
          {kpisLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summaryData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" name="Total" radius={[4, 4, 0, 0]} fill="#C0392B" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Graphique 2 — Tendances mensuelles réelles */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tendances mensuelles
            </CardTitle>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-xs border border-input rounded-md px-2 py-1 bg-background"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Dons, alertes et vies sauvées par mois
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="donations" name="Dons" stroke="#C0392B" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="alerts" name="Alertes" stroke="#D97706" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="livesSaved" name="Vies sauvées" stroke="#16A34A" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}