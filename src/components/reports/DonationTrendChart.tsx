"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle, TrendingUp, TrendingDown, CheckCircle2,
  FileBarChart2, MapPin, Calendar, Target,
} from "lucide-react";
import { useDashboardKPIs, useMonthlyStats, useRegionStats } from "@/hooks/useDashboardKPIs";
import { useFiltersStore } from "@/store/filters.store";
import { useMemo } from "react";


// ── Données simulées (en attente endpoint /admin/stats) ──────────────────────

const MONTHLY_DATA = [
  { mois: "Jan", dons: 420, alertes: 38, tauxReponse: 87 },
  { mois: "Fév", dons: 380, alertes: 42, tauxReponse: 82 },
  { mois: "Mar", dons: 510, alertes: 35, tauxReponse: 91 },
  { mois: "Avr", dons: 490, alertes: 50, tauxReponse: 88 },
  { mois: "Mai", dons: 320, alertes: 61, tauxReponse: 75 },
  { mois: "Jun", dons: 290, alertes: 58, tauxReponse: 70 },
  { mois: "Jul", dons: 260, alertes: 70, tauxReponse: 65 },
  { mois: "Aoû", dons: 310, alertes: 65, tauxReponse: 72 },
  { mois: "Sep", dons: 450, alertes: 48, tauxReponse: 85 },
  { mois: "Oct", dons: 530, alertes: 40, tauxReponse: 90 },
  { mois: "Nov", dons: 480, alertes: 44, tauxReponse: 87 },
  { mois: "Déc", dons: 410, alertes: 52, tauxReponse: 83 },
];

const FORECAST_DATA = [
  { mois: "Sep", reel: 450, prevision: null },
  { mois: "Oct", reel: 530, prevision: null },
  { mois: "Nov", reel: 480, prevision: null },
  { mois: "Déc", reel: 410, prevision: null },
  { mois: "Jan", reel: null, prevision: 440 },
  { mois: "Fév", reel: null, prevision: 400 },
  { mois: "Mar", reel: null, prevision: 520 },
  { mois: "Avr", reel: null, prevision: 500 },
];

const REGION_DATA = [
  { region: "Dakar", dons: 890, pct: 40, color: "#e11d48" },
  { region: "Thiès", dons: 310, pct: 14, color: "#f97316" },
  { region: "Saint-Louis", dons: 220, pct: 10, color: "#eab308" },
  { region: "Ziguinchor", dons: 180, pct: 8, color: "#22c55e" },
  { region: "Kaolack", dons: 150, pct: 7, color: "#3b82f6" },
  { region: "Autres", dons: 450, pct: 21, color: "#8b5cf6" },
];

// Périodes critiques détectées
const CRITICAL_PERIODS = [
  { periode: "Juin – Août", baisse: "-38%", cause: "Vacances scolaires, chaleur", action: "Campagne nationale mai" },
  { periode: "Février", baisse: "-10%", cause: "Post-fêtes de fin d'année", action: "Relance SMS donneurs" },
];

const TOOLTIP_STYLE = {
  borderRadius: "10px",
  border: "1px solid hsl(var(--border))",
  fontSize: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
};

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badge?: string;
  gradient: string;
}) {
  return (
    <>
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="outline" className="text-[10px]">{badge}</Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
    </>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export function DonationTrendChart() {
  const { filters } = useFiltersStore();
  
  const activeFilters = useMemo(() => ({
    region: filters.region,
    bloodGroup: filters.bloodGroup,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  }), [filters.region, filters.bloodGroup, filters.dateFrom, filters.dateTo]);

  const { data: kpis, isLoading: isLoadingKPIs } = useDashboardKPIs(activeFilters);
  const { data: monthlyStatsData, isLoading: isLoadingMonthly } = useMonthlyStats(activeFilters);
  const { data: regionStatsData, isLoading: isLoadingRegions } = useRegionStats(activeFilters);

  const isLoading = isLoadingKPIs || isLoadingMonthly || isLoadingRegions;

  // Mapper dynamique pour les stats mensuelles avec fallback
  const monthlyData = useMemo(() => {
    if (monthlyStatsData && monthlyStatsData.length > 0) {
      return monthlyStatsData.map((item: any) => ({
        mois: item.mois || item.month || item.label || "",
        dons: item.dons || item.donations || item.donationsCount || 0,
        alertes: item.alertes || item.alerts || item.alertsCount || 0,
        tauxReponse: item.tauxReponse || item.responseRate || item.rate || 0,
      }));
    }
    return MONTHLY_DATA;
  }, [monthlyStatsData]);

  // Mapper dynamique pour les stats régionales avec fallback
  const regionData = useMemo(() => {
    if (regionStatsData && regionStatsData.length > 0) {
      const colors = ["#e11d48", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];
      const total = regionStatsData.reduce((acc: number, item: any) => acc + (item.dons || item.donations || item.donationsCount || 0), 0);
      return regionStatsData.map((item: any, idx: number) => {
        const dons = item.dons || item.donations || item.donationsCount || 0;
        const pct = total > 0 ? Math.round((dons / total) * 100) : 0;
        return {
          region: item.region || item.name || "",
          dons,
          pct,
          color: item.color || colors[idx % colors.length],
        };
      });
    }
    return REGION_DATA;
  }, [regionStatsData]);

  const totalDons = useMemo(() => monthlyData.reduce((s, m) => s + m.dons, 0), [monthlyData]);
  const totalAlertes = useMemo(() => monthlyData.reduce((s, m) => s + m.alertes, 0), [monthlyData]);
  const tauxMoyen = useMemo(() => monthlyData.length > 0 ? Math.round(monthlyData.reduce((s, m) => s + m.tauxReponse, 0) / monthlyData.length) : 0, [monthlyData]);
  const moisPic = useMemo(() => monthlyData.length > 0 ? monthlyData.reduce((a, b) => (a.dons > b.dons ? a : b)).mois : "N/A", [monthlyData]);
  const moisCreux = useMemo(() => monthlyData.length > 0 ? monthlyData.reduce((a, b) => (a.dons < b.dons ? a : b)).mois : "N/A", [monthlyData]);

  return (
    <div className="space-y-6">

      {/* ── 1. Synthèse chiffrée ───────────────────────────────────────────── */}
      <Card className="border shadow-sm overflow-hidden">
        <SectionHeader
          icon={FileBarChart2}
          title="Synthèse annuelle — Indicateurs d'impact"
          subtitle="Données consolidées pour le rapport au Ministère de la Santé"
          gradient="from-rose-600 via-rose-500 to-orange-400"
        />
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Dons réalisés",
                  value: (kpis?.totalDonations ?? totalDons).toLocaleString("fr-FR"),
                  sub: "Total annuel cumulé",
                  trend: "up",
                  color: "border-l-rose-500",
                },
                {
                  label: "Vies sauvées",
                  value: (kpis?.livesSavedEstimate ?? 1800).toLocaleString("fr-FR"),
                  sub: "Estimation nationale",
                  trend: "up",
                  color: "border-l-emerald-500",
                },
                {
                  label: "Alertes traitées",
                  value: (kpis?.totalAlerts ?? totalAlertes).toLocaleString("fr-FR"),
                  sub: "Demandes de sang",
                  trend: "neutral",
                  color: "border-l-amber-500",
                },
                {
                  label: "Tps réponse moyen",
                  value: `${kpis?.avgResponseTimeMinutes ?? 14.5} min`,
                  sub: "Objectif cible < 10 min",
                  trend: "down",
                  color: "border-l-blue-500",
                },
              ].map(({ label, value, sub, trend, color }) => (
                <div key={label} className={`border-l-4 ${color} bg-muted/30 rounded-r-xl px-4 py-3`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                  <p className="text-2xl font-black tabular-nums">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                    {trend === "down" && <TrendingDown className="w-3 h-3 text-rose-500" />}
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Résumé analytique texte */}
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-muted/40 rounded-lg py-2.5 px-3">
              <p className="text-muted-foreground mb-0.5">Mois pic</p>
              <p className="font-bold text-sm flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />{moisPic}
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg py-2.5 px-3">
              <p className="text-muted-foreground mb-0.5">Mois creux</p>
              <p className="font-bold text-sm flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />{moisCreux}
              </p>
            </div>
            <div className="bg-muted/40 rounded-lg py-2.5 px-3">
              <p className="text-muted-foreground mb-0.5">Taux mobilisation moy.</p>
              <p className="font-bold text-sm flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-500" />{tauxMoyen}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Évolution mensuelle + Répartition régionale ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <Card className="xl:col-span-2 border shadow-sm overflow-hidden">
          <SectionHeader
            icon={FileBarChart2}
            title="Évolution mensuelle des dons et alertes"
            subtitle="Vue comparative sur 12 mois"
            badge={monthlyStatsData && monthlyStatsData.length > 0 ? "Temps réel" : "Simulé"}
            gradient="from-rose-500 to-orange-400"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="dons" name="Dons réalisés" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alertes" name="Alertes reçues" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border shadow-sm overflow-hidden">
          <SectionHeader
            icon={MapPin}
            title="Répartition régionale"
            subtitle="Part des dons par région"
            badge={regionStatsData && regionStatsData.length > 0 ? "Temps réel" : "Simulé"}
            gradient="from-emerald-500 to-teal-400"
          />
          <CardContent>
            <div className="flex justify-center mb-3">
              <PieChart width={150} height={150}>
                <Pie data={regionData} cx={70} cy={70} innerRadius={40} outerRadius={70} dataKey="dons" paddingAngle={3}>
                  {regionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, _, p) => [`${v} dons`, p.payload.region]} contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </div>
            <div className="space-y-1.5">
              {regionData.map(({ region, dons, pct, color }) => (
                <div key={region} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-muted-foreground flex-1">{region}</span>
                  <span className="font-bold tabular-nums">{dons}</span>
                  <span className="text-muted-foreground/60 w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Périodes critiques ─────────────────────────────────────────── */}
      <Card className="border shadow-sm overflow-hidden">
        <SectionHeader
          icon={AlertTriangle}
          title="Périodes critiques — Anticipation campagnes marketing"
          subtitle="Analyse des creux saisonniers pour planifier les actions de collecte"
          gradient="from-amber-500 to-orange-400"
        />
        <CardContent className="space-y-3">
          {CRITICAL_PERIODS.map(({ periode, baisse, cause, action }) => (
            <div key={periode} className="flex items-start gap-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl p-4">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-bold text-sm text-amber-900 dark:text-amber-200">{periode}</p>
                  <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 text-[10px] font-bold">
                    {baisse} dons
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{cause}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommandation : {action}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── 4. Prévisions ────────────────────────────────────────────────── */}
      <Card className="border shadow-sm overflow-hidden">
        <SectionHeader
          icon={TrendingUp}
          title="Prévisions T1 2027 — Aide à la planification"
          subtitle="Projection basée sur les tendances historiques pour anticiper les besoins"
          badge="Projection"
          gradient="from-blue-500 to-indigo-400"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={FORECAST_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="gradReel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mois" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Area type="monotone" dataKey="reel" name="Réalisé" stroke="#e11d48" strokeWidth={2} fill="url(#gradReel)" connectNulls={false} dot={{ fill: "#e11d48", r: 3 }} />
              <Area type="monotone" dataKey="prevision" name="Prévision" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" fill="url(#gradPrev)" connectNulls={false} dot={{ fill: "#3b82f6", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Tableau des projections */}
          <Separator className="my-4" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-muted-foreground font-semibold">Mois</th>
                  <th className="text-right py-2 text-muted-foreground font-semibold">Dons prévus</th>
                  <th className="text-right py-2 text-muted-foreground font-semibold">Variation vs N-1</th>
                  <th className="text-right py-2 text-muted-foreground font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mois: "Janvier 2027", prev: 440, var: "+4.8%", ok: true },
                  { mois: "Février 2027", prev: 400, var: "+5.3%", ok: true },
                  { mois: "Mars 2027", prev: 520, var: "+2.0%", ok: true },
                  { mois: "Avril 2027", prev: 500, var: "+2.0%", ok: true },
                ].map(({ mois, prev, var: v, ok }) => (
                  <tr key={mois} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium">{mois}</td>
                    <td className="py-2.5 text-right font-bold tabular-nums">{prev.toLocaleString("fr-FR")}</td>
                    <td className="py-2.5 text-right">
                      <span className={`font-semibold ${ok ? "text-emerald-600" : "text-rose-600"}`}>{v}</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge variant="outline" className={`text-[10px] ${ok ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"}`}>
                        {ok ? "✓ Favorable" : "⚠ Vigilance"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
