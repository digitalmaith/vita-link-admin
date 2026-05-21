"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { structuresService } from "@/services/structures.service";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const STATUS_COLORS = {
  VERIFIED:  "#22C55E",
  PENDING:   "#F59E0B",
  SUSPENDED: "#EF4444",
  REJECTED:  "#6B7280",
};

const STATUS_LABELS = {
  VERIFIED:  "Certifiée",
  PENDING:   "En attente",
  SUSPENDED: "Suspendue",
  REJECTED:  "Rejetée",
};

export function StructuresMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data } = useQuery({
    queryKey: ["structures"],
    queryFn: () => structuresService.getAll(),
  });

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-14.4524, 14.4974],
      zoom: 6.2,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !data?.structures) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    data.structures.forEach((structure) => {
      if (!structure.latitude || !structure.longitude) return;

      const color = STATUS_COLORS[structure.status];

      // Conteneur du marker
      const el = document.createElement("div");
      el.style.cssText = `
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
      `;

      // Anneau pulsant
      const ring = document.createElement("div");
      ring.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: ${color}33;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      `;

      // Point central
      const dot = document.createElement("div");
      dot.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${color};
        border: 2.5px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 12px ${color}99, 0 0 4px ${color};
        transition: transform 0.2s;
      `;

      // Nombre d'alertes si > 0
      if (structure._count.alerts > 0) {
        const badge = document.createElement("div");
        badge.style.cssText = `
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #EF4444;
          border: 2px solid #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          color: white;
          z-index: 10;
        `;
        badge.textContent = String(structure._count.alerts);
        el.appendChild(badge);
      }

      el.appendChild(ring);
      el.appendChild(dot);

      el.addEventListener("mouseenter", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1)";
      });

      // Style du popup dark
      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        className: "vita-popup",
      }).setHTML(`
        <div style="
          background: #0f172a;
          border: 1px solid ${color}44;
          border-radius: 10px;
          padding: 12px;
          min-width: 200px;
          font-family: system-ui, sans-serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        ">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="
              width:8px;height:8px;border-radius:50%;
              background:${color};
              box-shadow: 0 0 6px ${color};
            "></div>
            <p style="font-weight:700;font-size:13px;color:#f1f5f9;margin:0;">
              ${structure.name}
            </p>
          </div>
          <p style="font-size:11px;color:#64748b;margin:0 0 10px;padding-left:16px;">
            ${structure.address}
          </p>
          <div style="
            display:grid;grid-template-columns:1fr 1fr 1fr;
            gap:6px;margin-bottom:10px;
          ">
            <div style="background:#1e293b;border-radius:6px;padding:6px;text-align:center;">
              <p style="font-size:16px;font-weight:700;color:#f1f5f9;margin:0;">
                ${structure._count.staffMembers}
              </p>
              <p style="font-size:9px;color:#64748b;margin:0;">Agents</p>
            </div>
            <div style="background:#1e293b;border-radius:6px;padding:6px;text-align:center;">
              <p style="font-size:16px;font-weight:700;color:#f1f5f9;margin:0;">
                ${structure._count.alerts}
              </p>
              <p style="font-size:9px;color:#64748b;margin:0;">Alertes</p>
            </div>
            <div style="background:#1e293b;border-radius:6px;padding:6px;text-align:center;">
              <p style="font-size:16px;font-weight:700;color:#f59e0b;margin:0;">
                ${structure._count.donations}
              </p>
              <p style="font-size:9px;color:#64748b;margin:0;">Dons</p>
            </div>
          </div>
          <span style="
            display:inline-block;padding:3px 10px;
            border-radius:9999px;font-size:10px;font-weight:600;
            background:${color}22;color:${color};
            border: 1px solid ${color}44;
          ">${STATUS_LABELS[structure.status]}</span>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([structure.longitude, structure.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, data]);

  const structures = data?.structures ?? [];
  const verified  = structures.filter((s) => s.status === "VERIFIED").length;
  const pending   = structures.filter((s) => s.status === "PENDING").length;
  const suspended = structures.filter((s) => s.status === "SUSPENDED").length;
  const total     = structures.length;

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10" style={{ height: "480px" }}>
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-xs font-semibold tracking-wide uppercase">
            Réseau Vita-Link — Sénégal
          </span>
          <span className="text-white/50 text-xs">•</span>
          <span className="text-white/70 text-xs">{total} structure{total > 1 ? "s" : ""}</span>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4">
          {[
            { color: "#22C55E", label: `${verified} certifiée${verified > 1 ? "s" : ""}` },
            { color: "#F59E0B", label: `${pending} en attente` },
            { color: "#EF4444", label: `${suspended} suspendue${suspended > 1 ? "s" : ""}` },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: color, boxShadow: `0 0 6px ${color}`,
              }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Carte */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Animation ping CSS */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .vita-popup .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .vita-popup .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}