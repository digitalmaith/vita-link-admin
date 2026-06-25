"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Search, SlidersHorizontal, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REGIONS } from "@/lib/constants";
import { STATUS_CONFIG } from "@/lib/constants/map.constants";
import { useStructuresMap } from "@/hooks/map/useStructuresMap";
import { useMapInit } from "@/hooks/map/useMapInit";
import { useMapMarkers } from "@/hooks/map/useMapMarkers";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export function StructuresMap() {
  const {
    mapContainer, mapRef, markersRef, clusterRef,
    mapLoaded, setMapLoaded,
    selectedRegion, showSearch, setShowSearch,
    searchQuery, setSearchQuery,
    showLegend, setShowLegend,
    mapStyle, setMapStyle,
    filteredStructures, regionCounts, stats,
    handleRegionSelect, handleZoomIn, handleZoomOut, handleResetView,
  } = useStructuresMap();

  useMapInit({ mapContainer, mapRef, mapStyle, setMapLoaded });
  useMapMarkers({ mapLoaded, mapRef, markersRef, clusterRef, filteredStructures, selectedRegion });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ height: "600px" }}
    >
      {/* Header */}
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
              {(["dark", "light", "satellite"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setMapStyle(style)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    mapStyle === style ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
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

      {/* Recherche */}
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
                selectedRegion === "ALL" ? "bg-red-600 text-white" : "bg-white/10 text-white/80"
              }`}
            >
              🌍 Toutes ({stats.total})
            </button>
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionSelect(region)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ${
                  selectedRegion === region ? "bg-red-600 text-white" : "bg-white/10 text-white/80"
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

      {/* Zoom controls */}
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

      <div ref={mapContainer} className="w-full h-full" />

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .vita-popup .mapboxgl-popup-content { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
        .vita-popup .mapboxgl-popup-tip { border-top-color: #1e293b !important; }
        .popup-card { background: linear-gradient(135deg, #0f172a, #1e293b); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; min-width: 250px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
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