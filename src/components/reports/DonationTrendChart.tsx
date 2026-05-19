"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { Skeleton } from "@/components/ui/skeleton";

// Données simulées pour la tendance mensuelle
// À remplacer quand l'endpoint /admin/stats sera disponible
const MOCK_TREND = [
  { mois: "Jan", dons: 420, alertes: 38 },
  { mois: "Fév", dons: 380, alertes: 42 },
  { mois: "Mar", dons: 510, alertes: 35 },
  { mois: "Avr", dons: 490, alertes: 50 },
  { mois: "Mai", dons: 320, alertes: 61 },
  { mois: "Jun", dons: 290, alertes: 58 },
  { mois: "Jul", dons: 260, alertes: 70 },
  { mois: "Aoû", dons: 310, alertes: 65 },
  { mois: "Sep", dons: 450, alertes: 48 },
  { mois: "Oct", dons: 530, alertes: 40 },
  { mois: "Nov", dons: 480, alertes: 44 },
  { mois: "Déc", dons: 410, alertes: 52 },
];

export function DonationTrendChart() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  // Données réelles du dashboard pour le graphique récapitulatif
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
          {isLoading ? (
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
                <Bar dataKey="value" name="Total" radius={[4, 4, 0, 0]}>
                  {summaryData.map((entry, index) => (
                    <rect key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Graphique 2 — Tendance mensuelle simulée */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Tendances mensuelles
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Données simulées — en attente de l'endpoint /admin/stats
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="dons" name="Dons" fill="#C0392B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alertes" name="Alertes" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}