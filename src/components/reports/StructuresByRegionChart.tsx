"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { REGIONS } from "@/lib/constants";

// Données simulées — à remplacer quand il y aura des données réelles
const MOCK_DATA = REGIONS.map((region) => ({
  region: region.slice(0, 8), // raccourci pour l'affichage
  fullRegion: region,
  total: Math.floor(Math.random() * 10),
  verified: Math.floor(Math.random() * 6),
  pending: Math.floor(Math.random() * 4),
}));

export function StructuresByRegionChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats", "regions"],
    queryFn: () => dashboardService.getRegionStats(),
  });

  // Utiliser les données réelles si disponibles, sinon les simulées
  const chartData = data?.data && data.data.length > 0
    ? data.data.map((d) => ({
        region: d.region.slice(0, 8),
        fullRegion: d.region,
        total: d.total,
        verified: d.verified,
        pending: d.pending,
      }))
    : MOCK_DATA;

  const isMockData = !data?.data || data.data.length === 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Structures de santé par région
        </CardTitle>
        {isMockData && (
          <p className="text-xs text-amber-600">
            Données simulées — en attente de données réelles
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "12px",
                }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullRegion ?? label;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="verified" name="Certifiées" fill="#16A34A" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="pending" name="En attente" fill="#D97706" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}