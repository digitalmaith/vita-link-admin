"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Données simulées — à remplacer par l'appel API /reports quand l'endpoint est dispo
const MOCK_DATA = [
  { mois: "Jan", dons: 420, alertes: 38, viesSauvees: 31 },
  { mois: "Fév", dons: 380, alertes: 42, viesSauvees: 29 },
  { mois: "Mar", dons: 510, alertes: 35, viesSauvees: 33 },
  { mois: "Avr", dons: 490, alertes: 50, viesSauvees: 44 },
  { mois: "Mai", dons: 320, alertes: 61, viesSauvees: 40 },
  { mois: "Jun", dons: 290, alertes: 58, viesSauvees: 36 },
  { mois: "Jul", dons: 260, alertes: 70, viesSauvees: 38 },
  { mois: "Aoû", dons: 310, alertes: 65, viesSauvees: 42 },
  { mois: "Sep", dons: 450, alertes: 48, viesSauvees: 45 },
  { mois: "Oct", dons: 530, alertes: 40, viesSauvees: 38 },
  { mois: "Nov", dons: 480, alertes: 44, viesSauvees: 41 },
  { mois: "Déc", dons: 410, alertes: 52, viesSauvees: 47 },
];

export function DonationTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Tendances annuelles — Dons, alertes et vies sauvées
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Les périodes creuses (juin–août) sont idéales pour les campagnes marketing.
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={MOCK_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="mois"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="dons"
              name="Dons"
              stroke="#C0392B"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="alertes"
              name="Alertes"
              stroke="#D97706"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="viesSauvees"
              name="Vies sauvées"
              stroke="#16A34A"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}