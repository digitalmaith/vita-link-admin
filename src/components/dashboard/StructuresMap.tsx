"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { structuresService } from "@/services/structures.service";
import { REGIONS } from "@/lib/constants";
import type { Region } from "@/types";
import {
  Map as MapIcon,
  Building2,
  AlertCircle,
  Gift,
  Search,
  SlidersHorizontal,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const SENEGAL_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-17.5, 12.3],
  [-11.3, 15.0],
];

const SENEGAL_CENTER: [number, number] = [-14.4524, 14.4974];

const STATUS_CONFIG = {
  VERIFIED: { color: "#22C55E", bgColor: "#22C55E22", label: "Certifiée", icon: "✓" },
  PENDING_REVIEW: { color: "#F59E0B", bgColor: "#F59E0B22", label: "En attente", icon: "⏳" },
  SUSPENDED: { color: "#EF4444", bgColor: "#EF444422", label: "Suspendue", icon: "⚠" },
  REJECTED: { color: "#6B7280", bgColor: "#6B728022", label: "Rejetée", icon: "✕" },
};

export function StructuresMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | "ALL">("ALL");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const [mapStyle, setMapStyle] = useState<"dark" | "light" | "satellite">("dark");

  const { data } = useQuery({
    queryKey: ["structures"],
    queryFn: () => structuresService.getAll(),
  });

  const structures = data?.structures ?? [];

  // Filtrer les structures
  const filteredStructures = useMemo(() => {
    let filtered = selectedRegion === "ALL"
      ? structures
      : structures.filter((s) =>
          s.address.toLowerCase().includes(selectedRegion.toLowerCase())
        );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [structures, selectedRegion, searchQuery]);

  // Compteurs par région (optimisé)
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    REGIONS.forEach((region) => {
      counts[region] = structures.filter((s) =>
        s.address.toLowerCase().includes(region.toLowerCase())
      ).length;
    });
    return counts;
  }, [structures]);

  // Statistiques
  const stats = useMemo(() => ({
    total: filteredStructures.length,
    verified: filteredStructures.filter((s) => s.status === "VERIFIED").length,
    pending: filteredStructures.filter((s) => s.status === "PENDING_REVIEW").length,
    suspended: filteredStructures.filter((s) => s.status === "SUSPENDED").length,
    totalAlerts: filteredStructures.reduce((acc, s) => acc + (s._count?.alerts || 0), 0),
    totalDonations: filteredStructures.reduce((acc, s) => acc + (s._count?.donations || 0), 0),
  }), [filteredStructures]);

  const mapStyles = {
    dark: "mapbox://styles/mapbox/dark-v11",
    light: "mapbox://styles/mapbox/light-v11",
    satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  };

  // Initialiser la carte
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[mapStyle],
      center: SENEGAL_CENTER,
      zoom: 6.2,
      minZoom: 5.5,
      maxZoom: 12,
      maxBounds: SENEGAL_BOUNDS,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("load", () => {
      setMapLoaded(true);
      map.flyTo({
        center: SENEGAL_CENTER,
        zoom: 6.5,
        duration: 2000,
      });
    });

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(mapStyles[mapStyle]);
  }, [mapStyle]);

  // Ajouter les markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    filteredStructures.forEach((structure) => {
      if (!structure.latitude || !structure.longitude) return;

      const config = STATUS_CONFIG[structure.status];
      const hasAlerts = (structure._count?.alerts || 0) > 0;
      const alertCount = structure._count?.alerts || 0;

      const el = document.createElement("div");
      el.style.cssText = `
        position: relative;
        width: 44px;
        height: 44px;
        cursor: pointer;
      `;

      const ring1 = document.createElement("div");
      ring1.style.cssText = `
        position: absolute; inset: 0; border-radius: 50%;
        background: ${config.color}; opacity: 0.3;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      `;

      const ring2 = document.createElement("div");
      ring2.style.cssText = `
        position: absolute; inset: 4px; border-radius: 50%;
        background: ${config.color}; opacity: 0.2;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;
      `;

      const dot = document.createElement("div");
      dot.style.cssText = `
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 16px; height: 16px; border-radius: 50%;
        background: ${config.color};
        border: 2.5px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 0 16px ${config.color}, 0 0 32px ${config.color}44;
        transition: all 0.3s;
      `;

      if (hasAlerts) {
        const badge = document.createElement("div");
        badge.style.cssText = `
          position: absolute; top: -6px; right: -6px;
          min-width: 20px; height: 20px; border-radius: 10px;
          background: linear-gradient(135deg, #EF4444, #DC2626);
          border: 2px solid #0f172a;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px; font-size: 10px; font-weight: 700;
          color: white; z-index: 10;
        `;
        badge.textContent = alertCount > 99 ? "99+" : String(alertCount);
        el.appendChild(badge);
      }

      el.appendChild(ring1);
      el.appendChild(ring2);
      el.appendChild(dot);

      el.addEventListener("mouseenter", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1.5)";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1)";
      });

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        className: "vita-popup",
        maxWidth: "300px",
      }).setHTML(`
        <div class="popup-card">
          <div class="popup-header" style="border-left: 3px solid ${config.color};">
            <h3>${structure.name}</h3>
            <span class="status-badge" style="background:${config.bgColor};color:${config.color};border:1px solid ${config.color}44;">
              ${config.icon} ${config.label}
            </span>
          </div>
          <p class="popup-address">📍 ${structure.address}</p>
          <div class="popup-stats">
            <div class="stat-item">
              <span class="stat-value">${structure._count?.staffMembers || 0}</span>
              <span class="stat-label">Agents</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${structure._count?.alerts || 0}</span>
              <span class="stat-label">Alertes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" style="color:#F59E0B;">${structure._count?.donations || 0}</span>
              <span class="stat-label">Dons</span>
            </div>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([structure.longitude, structure.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
      bounds.extend([structure.longitude, structure.latitude]);
    });

    if (filteredStructures.length > 0 && selectedRegion !== "ALL") {
      mapRef.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 120, left: 50, right: 50 },
        maxZoom: 10,
        duration: 1000,
      });
    }
  }, [mapLoaded, filteredStructures]);

  const handleRegionSelect = useCallback((region: Region | "ALL") => {
    setSelectedRegion(region);
  }, []);

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 500 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 500 });
  const handleResetView = () => {
    mapRef.current?.flyTo({ center: SENEGAL_CENTER, zoom: 6.2, duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ height: "600px" }}
    >
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent h-24" />
        <div className="relative px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg"
              >
                <MapIcon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-white font-bold text-sm">Réseau Vita-Link</h2>
                <p className="text-white/60 text-xs">
                  {stats.total} structure{stats.total > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["dark", "light", "satellite"].map((style) => (
                <button
                  key={style}
                  onClick={() => setMapStyle(style as any)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    mapStyle === style
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {style === "dark" ? "Sombre" : style === "light" ? "Clair" : "Satellite"}
                </button>
              ))}
              <button onClick={() => setShowSearch(!showSearch)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </button>
              <button onClick={() => setShowLegend(!showLegend)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-5 right-5 z-20"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher une structure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-900/90 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Légende */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-5 z-20 bg-gray-900/95 border border-white/10 rounded-xl p-4 min-w-[180px]"
          >
            <h4 className="text-white text-xs font-semibold mb-3">Légende</h4>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                  <span className="text-white/70 text-xs">{config.label}</span>
                </div>
                <span className="text-white/50 text-xs">
                  {stats[key.toLowerCase() as keyof typeof stats] || 0}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres région */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent h-32" />
        <div className="relative px-5 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleRegionSelect("ALL")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ${
                selectedRegion === "ALL"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white/80"
              }`}
            >
              🌍 Toutes ({stats.total})
            </button>
            
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionSelect(region)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ${
                  selectedRegion === region
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                📍 {region}
                {regionCounts[region] > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                    {regionCounts[region]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="absolute bottom-32 right-5 z-20 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="w-10 h-10 rounded-xl bg-gray-900/90 border border-white/10 flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button onClick={handleZoomOut} className="w-10 h-10 rounded-xl bg-gray-900/90 border border-white/10 flex items-center justify-center">
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
        <button onClick={handleResetView} className="w-10 h-10 rounded-xl bg-gray-900/90 border border-white/10 flex items-center justify-center">
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Carte */}
      <div ref={mapContainer} className="w-full h-full" />

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .vita-popup .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .vita-popup .mapboxgl-popup-tip {
          border-top-color: #1e293b !important;
        }
        .popup-card {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          min-width: 250px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .popup-header { padding-left: 12px; margin-bottom: 8px; }
        .popup-header h3 { font-weight: 700; font-size: 14px; color: #f1f5f9; margin: 0 0 6px; }
        .status-badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .popup-address { font-size: 11px; color: #64748b; margin: 0 0 12px; padding-left: 12px; }
        .popup-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .stat-item { background: #1e293b; border-radius: 8px; padding: 8px; text-align: center; }
        .stat-value { font-size: 16px; font-weight: 700; color: #f1f5f9; display: block; }
        .stat-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
}