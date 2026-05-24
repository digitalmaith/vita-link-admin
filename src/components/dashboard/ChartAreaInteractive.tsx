"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useFiltersStore } from "@/store/filters.store";
import { useChartData } from "@/hooks/useDashboardKPIs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, AlertCircle,
  Calendar, BarChart3,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Configuration du graphique ──────────────────────────

const chartConfig = {
  donations: {
    label: "Dons",
    color: "hsl(142, 71%, 45%)",
  },
  alerts: {
    label: "Alertes",
    color: "hsl(0, 84%, 60%)",
  },
  livesSaved: {
    label: "Vies sauvées",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig;

// ─── Skeleton ─────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <Card className="relative border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-5 w-40 bg-white/5" />
          <Skeleton className="h-4 w-60 bg-white/5" />
        </div>
        <Skeleton className="h-9 w-[120px] rounded-xl bg-white/5" />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-[300px] w-full rounded-xl bg-white/5" />
      </CardContent>
    </Card>
  );
}

// ─── Stats Card ───────────────────────────────────────────

function StatIndicator({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-xl", `bg-${color}-500/10`)}>
        <Icon className={cn("w-4 h-4", `text-${color}-500`)} />
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-white/50">{label}</p>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────

export function ChartAreaInteractive() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { filters } = useFiltersStore();

  const { data: chartResponse, isLoading } = useChartData({ 
    year: selectedYear,
    region: filters.region,
    bloodGroup: filters.bloodGroup,
  });

  const chartData = chartResponse?.data ?? [];

  // Calcul des totaux
  const totals = useMemo(() => {
    return chartData.reduce((acc, d) => ({
      donations: acc.donations + (d.donations || 0),
      alerts: acc.alerts + (d.alerts || 0),
      livesSaved: acc.livesSaved + (d.livesSaved || 0),
    }), { donations: 0, alerts: 0, livesSaved: 0 });
  }, [chartData]);

  // Années disponibles
  const availableYears = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => currentYear - i),
    [currentYear]
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5" />
      
      <CardHeader className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-0 border-b border-white/10 pb-5">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            Évolution mensuelle
          </CardTitle>
          <CardDescription className="text-white/50">
            Dons, alertes et vies sauvées en {selectedYear}
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini stats */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <StatIndicator
              label="Dons"
              value={totals.donations}
              icon={Activity}
              color="green"
            />
            <div className="w-px h-8 bg-white/10" />
            <StatIndicator
              label="Alertes"
              value={totals.alerts}
              icon={AlertCircle}
              color="red"
            />
            <div className="w-px h-8 bg-white/10" />
            <StatIndicator
              label="Vies sauvées"
              value={totals.livesSaved}
              icon={Heart}
              color="blue"
            />
          </div>

          {/* Sélecteur d'année */}
          <Select 
            value={String(selectedYear)} 
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[120px] rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all">
              <Calendar className="w-4 h-4 mr-2 text-white/60" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-slate-900 border-white/10">
              {availableYears.map((year) => (
                <SelectItem 
                  key={year} 
                  value={String(year)}
                  className="text-white hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="relative px-2 pt-4 sm:px-6 sm:pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  {Object.entries(chartConfig).map(([key, config]) => (
                    <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={config.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid 
                  vertical={false} 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeDasharray="4 4" 
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("fr-FR", { month: "short" });
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  width={40}
                />

                <ChartTooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      className="bg-slate-900 border-white/10 text-white shadow-xl backdrop-blur-xl"
                      labelFormatter={(value: React.ReactNode) => {
                        // ✅ Corrigé : accepter ReactNode
                        const strValue = typeof value === 'string' ? value : String(value ?? '');
                        if (!strValue) return '';
                        try {
                          const date = new Date(strValue);
                          if (isNaN(date.getTime())) return strValue;
                          return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
                        } catch {
                          return strValue;
                        }
                      }}
                      indicator="line"
                    />
                  }
                />

                {Object.entries(chartConfig).map(([key, config]) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#fill-${key})`}
                    stroke={config.color}
                    strokeWidth={2}
                    stackId="1"
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))}

                <ChartLegend content={<ChartLegendContent className="text-white/70" />} />
              </AreaChart>
            </ChartContainer>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Données mises à jour mensuellement</span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/50">
            {selectedYear}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}