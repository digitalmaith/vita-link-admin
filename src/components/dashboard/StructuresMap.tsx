"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { structuresService } from "@/services/structures.service";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const STATUS_COLORS = {
  VERIFIED:  "#16A34A",
  PENDING_REVIEW:   "#D97706",
  SUSPENDED: "#DC2626",
  REJECTED:  "#6B7280",
};

const STATUS_LABELS = {
  VERIFIED:  "Certifiée",
  PENDING_REVIEW:   "En attente",
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

  // Initialiser la carte une seule fois
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-14.4524, 14.4974],
      zoom: 6,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.on("load", () => setMapLoaded(true));

    mapRef.current = map;
  }, []);

  // Ajouter les markers
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !data?.structures) return;

    // Supprimer anciens markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    data.structures.forEach((structure) => {
      if (!structure.latitude || !structure.longitude) return;

      const el = document.createElement("div");
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${STATUS_COLORS[structure.status]};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: transform 0.2s;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "rotate(-45deg) scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "rotate(-45deg) scale(1)";
      });

      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: false,
      }).setHTML(`
        <div style="padding:8px;min-width:180px;font-family:Arial,sans-serif;">
          <p style="font-weight:600;font-size:13px;margin:0 0 4px;">${structure.name}</p>
          <p style="font-size:11px;color:#888;margin:0 0 6px;">${structure.address}</p>
          <div style="display:flex;gap:10px;font-size:11px;color:#555;">
            <span>👥 ${structure._count.staffMembers}</span>
            <span>🔔 ${structure._count.alerts}</span>
            <span>🩸 ${structure._count.donations}</span>
          </div>
          <span style="
            display:inline-block;margin-top:6px;padding:2px 8px;
            border-radius:9999px;font-size:10px;font-weight:600;
            background:${STATUS_COLORS[structure.status]}33;
            color:${STATUS_COLORS[structure.status]};
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
  const pending   = structures.filter((s) => s.status === "PENDING_REVIEW").length;
  const suspended = structures.filter((s) => s.status === "SUSPENDED").length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Carte des structures de santé
        </CardTitle>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Certifiées ({verified})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            En attente ({pending})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Suspendues ({suspended})
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={mapContainer}
          style={{ height: "420px", width: "100%" }}
          className="rounded-b-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
}