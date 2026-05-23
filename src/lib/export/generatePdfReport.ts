
import type { DashboardKPIs } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportOptions {
  kpis: DashboardKPIs;
  period?: string;
  generatedBy?: string;
}

export async function generatePdfReport({ kpis, period, generatedBy }: ReportOptions): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const periodLabel = period ?? `Rapport du ${today}`;
  let y = 0;

  // Valeurs par défaut pour les propriétés optionnelles
  const totalDonors = kpis.totalDonors ?? 0;
  const totalStructures = kpis.totalStructures ?? 0;
  const totalDonations = kpis.totalDonations ?? 0;
  const totalAlerts = kpis.totalAlerts ?? 0;
  const livesSavedEstimate = kpis.livesSavedEstimate ?? 0;
  const avgResponseTimeMinutes = kpis.avgResponseTimeMinutes ?? 0;
  const criticalStocksCount = kpis.criticalStocksCount ?? 0;
  const pendingStructuresValue = (kpis as any).pendingStructures ?? 0;

  // ── Couleurs ──
  const RED: [number, number, number] = [193, 32, 44];
  const DARK: [number, number, number] = [20, 20, 30];
  const GRAY: [number, number, number] = [100, 110, 120];
  const LIGHT_GRAY: [number, number, number] = [245, 246, 248];
  const WHITE: [number, number, number] = [255, 255, 255];
  const GREEN: [number, number, number] = [22, 163, 74];
  const AMBER: [number, number, number] = [217, 119, 6];

  // ── Helpers ──
  function setFont(size: number, style: "normal" | "bold" = "normal", color: [number, number, number] = DARK) {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(color[0], color[1], color[2]);
  }

  function drawRect(x: number, yPos: number, w: number, h: number, color: [number, number, number], radius = 0) {
    doc.setFillColor(color[0], color[1], color[2]);
    if (radius > 0) {
      doc.roundedRect(x, yPos, w, h, radius, radius, "F");
    } else {
      doc.rect(x, yPos, w, h, "F");
    }
  }

  function drawLine(yPos: number, color: [number, number, number] = [220, 225, 230]) {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, yPos, W - MARGIN, yPos);
  }

  // ════════════════════════════════
  // PAGE 1 — EN-TÊTE
  // ════════════════════════════════

  // Bannière rouge
  drawRect(0, 0, W, 38, RED);

  // Logo texte VITA-LINK
  setFont(22, "bold", WHITE);
  doc.text("VITA-LINK", MARGIN, 16);

  setFont(8, "normal", [255, 180, 180]);
  doc.text("Système National de Gestion des Dons de Sang", MARGIN, 22);

  // Badge "RAPPORT OFFICIEL"
  drawRect(W - MARGIN - 46, 6, 46, 10, [160, 20, 30], 2);
  setFont(7, "bold", WHITE);
  doc.text("RAPPORT OFFICIEL", W - MARGIN - 43, 12.5);

  // Sous-titre période
  setFont(9, "normal", [255, 210, 210]);
  doc.text(periodLabel, MARGIN, 30);

  y = 48;

  // Destinataire
  drawRect(MARGIN, y, CONTENT_W, 18, LIGHT_GRAY, 3);
  setFont(7, "normal", GRAY);
  doc.text("DESTINATAIRE", MARGIN + 4, y + 5.5);
  setFont(9, "bold", DARK);
  doc.text("Ministère de la Santé et de l'Action Sociale — République du Sénégal", MARGIN + 4, y + 12);

  y += 24;

  // Titre section
  setFont(11, "bold", RED);
  doc.text("Indicateurs Clés de Performance", MARGIN, y);
  drawLine(y + 2, RED);
  y += 8;

  // ── KPI Cards (2 colonnes) ──
  const cards = [
    { label: "Donneurs Actifs (Jambaars)", value: totalDonors.toLocaleString("fr-FR"), sublabel: "Enregistrés sur la plateforme", color: RED },
    { label: "Structures de Santé", value: totalStructures.toLocaleString("fr-FR"), sublabel: "Hôpitaux & centres partenaires", color: [41, 128, 185] as [number, number, number] },
    { label: "Dons Réalisés", value: totalDonations.toLocaleString("fr-FR"), sublabel: "Total cumulé à ce jour", color: GREEN },
    { label: "Alertes Traitées", value: totalAlerts.toLocaleString("fr-FR"), sublabel: "Demandes de sang enregistrées", color: AMBER },
    { label: "Vies Sauvées (Estimation)", value: livesSavedEstimate.toLocaleString("fr-FR"), sublabel: "Impact sur la mortalité hémorragique", color: [142, 68, 173] as [number, number, number] },
    { label: "Temps de Réponse Moyen", value: `${avgResponseTimeMinutes} min`, sublabel: "Depuis déclenchement de l'alerte", color: [230, 126, 34] as [number, number, number] },
  ];

  const colW = (CONTENT_W - 4) / 2;
  cards.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MARGIN + col * (colW + 4);
    const cy = y + row * 22;

    drawRect(cx, cy, colW, 19, LIGHT_GRAY, 2);
    // Barre colorée gauche
    drawRect(cx, cy, 3, 19, card.color, 2);

    setFont(7, "normal", GRAY);
    doc.text(card.label.toUpperCase(), cx + 7, cy + 5.5);
    setFont(11, "bold", card.color);
    doc.text(card.value, cx + 7, cy + 12.5);
    setFont(6.5, "normal", GRAY);
    doc.text(card.sublabel, cx + 7, cy + 17);
  });

  y += Math.ceil(cards.length / 2) * 22 + 8;

  // ── Indicateurs complémentaires ──
  setFont(11, "bold", RED);
  doc.text("Indicateurs Complémentaires", MARGIN, y);
  drawLine(y + 2, RED);
  y += 8;

  // Calcul des valeurs avec gestion des undefined
  const coverageRate = Math.min(100, Math.round((totalDonors / 5000) * 100));
  const alertEfficiency = totalAlerts > 0 ? Math.round((totalDonations / totalAlerts) * 100) : 0;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Indicateur", "Valeur", "Statut"]],
    body: [
      [
        "Stocks critiques détectés",
        `${criticalStocksCount} stock(s)`,
        criticalStocksCount > 0 ? "⚠ Attention requise" : "✓ Normal",
      ],
      [
        "Structures en attente de validation",
        `${pendingStructuresValue} structure(s)`,
        pendingStructuresValue > 0 ? "En cours de traitement" : "✓ À jour",
      ],
      [
        "Taux de couverture nationale",
        `${coverageRate}%`,
        "Objectif : 100% d'ici 2026",
      ],
      [
        "Efficacité alertes (dons/alertes)",
        `${alertEfficiency}%`,
        "Indicateur de réactivité",
      ],
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: RED, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: "center" },
      2: { cellWidth: 54 },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || y + 50;
  y = finalY + 10;

  // ── Section Impact Mortalité ──
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  setFont(11, "bold", RED);
  doc.text("Impact sur la Réduction de la Mortalité Hémorragique", MARGIN, y);
  drawLine(y + 2, RED);
  y += 8;

  // Encadré impact
  drawRect(MARGIN, y, CONTENT_W, 32, [254, 242, 242], 3);
  doc.setDrawColor(RED[0], RED[1], RED[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, 32, 3, 3, "S");

  setFont(9, "bold", RED);
  doc.text(`${livesSavedEstimate.toLocaleString("fr-FR")} vies sauvées`, MARGIN + 4, y + 8);

  setFont(8, "normal", DARK);
  const impactText = [
    `Grâce à la réactivité de la plateforme Vita-Link, ${livesSavedEstimate.toLocaleString("fr-FR")} vies ont été`,
    `sauvées grâce à des interventions rapides (temps moyen : ${avgResponseTimeMinutes} min).`,
    `${totalDonors.toLocaleString("fr-FR")} donneurs mobilisés ont répondu à ${totalAlerts.toLocaleString("fr-FR")} alertes`,
    `enregistrées dans ${totalStructures} structures de santé partenaires à l'échelle nationale.`,
  ];
  impactText.forEach((line, i) => {
    doc.text(line, MARGIN + 4, y + 15 + i * 4.5);
  });

  y += 40;

  // ── Recommandations ──
  setFont(11, "bold", RED);
  doc.text("Recommandations", MARGIN, y);
  drawLine(y + 2, RED);
  y += 8;

  const recommendations = [
    ["Campagnes marketing ciblées", "Juin–Août représentent une période de baisse historique des dons. Lancer des campagnes de sensibilisation nationales dès Mai."],
    ["Renforcement des stocks", `${criticalStocksCount} stock(s) critique(s) détecté(s). Augmenter les collectes préventives dans les régions déficitaires.`],
    ["Expansion du réseau", `Objectif : ${(totalDonors + 500).toLocaleString("fr-FR")} donneurs actifs. Recruter via les universités et associations.`],
    ["Optimisation des délais", `Temps moyen actuel : ${avgResponseTimeMinutes} min. Objectif cible : < 10 min grâce aux notifications push.`],
  ];

  recommendations.forEach(([titre, desc], i) => {
    drawRect(MARGIN, y, 5, 14, RED, 1);
    setFont(8.5, "bold", DARK);
    doc.text(`${i + 1}. ${titre}`, MARGIN + 9, y + 5);
    setFont(7.5, "normal", GRAY);
    const lines = doc.splitTextToSize(desc, CONTENT_W - 10);
    doc.text(lines, MARGIN + 9, y + 10);
    y += 18;
  });

  // ════════════════════════════════
  // PIED DE PAGE — toutes les pages
  // ════════════════════════════════
    const pageCount = (doc as any).getNumberOfPages?.() || 
                    (doc as any).internal?.pages?.length || 
                    1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawRect(0, 287, W, 10, RED);
    setFont(7, "normal", [255, 200, 200]);
    doc.text(
      `Vita-Link · Rapport généré le ${today}${generatedBy ? ` · Par : ${generatedBy}` : ""} · Confidentiel — Ministère de la Santé`,
      MARGIN,
      293
    );
    setFont(7, "bold", WHITE);
    doc.text(`${i} / ${pageCount}`, W - MARGIN, 293, { align: "right" });
  }

  // ── Téléchargement ──
  const filename = `VitaLink_Rapport_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// -- Export Excel (données brutes) --
export async function generateExcelReport(kpis: DashboardKPIs, period?: string): Promise<void> {
  const XLSX = await import("xlsx");
  const { utils, writeFile } = XLSX;

  const today = new Date().toLocaleDateString("fr-FR");
  
  // Valeurs par défaut pour les propriétés optionnelles
  const totalDonors = kpis.totalDonors ?? 0;
  const totalStructures = kpis.totalStructures ?? 0;
  const totalDonations = kpis.totalDonations ?? 0;
  const totalAlerts = kpis.totalAlerts ?? 0;
  const livesSavedEstimate = kpis.livesSavedEstimate ?? 0;
  const avgResponseTimeMinutes = kpis.avgResponseTimeMinutes ?? 0;
  const criticalStocksCount = kpis.criticalStocksCount ?? 0;
  const pendingStructuresValue = (kpis as any).pendingStructures ?? 0;
  
  const coverageRate = Math.min(100, Math.round((totalDonors / 5000) * 100));
  const alertEfficiency = totalAlerts > 0 ? Math.round((totalDonations / totalAlerts) * 100) : 0;

  const kpiSheet = utils.aoa_to_sheet([
    ["VITA-LINK — Export de données", "", ""],
    ["Généré le", today, ""],
    ["Période", period ?? "Toutes les données disponibles", ""],
    ["", "", ""],
    ["INDICATEUR", "VALEUR", "UNITÉ"],
    ["Donneurs actifs (Jambaars)", totalDonors, "personnes"],
    ["Structures de santé partenaires", totalStructures, "structures"],
    ["Dons réalisés (total cumulé)", totalDonations, "dons"],
    ["Alertes enregistrées", totalAlerts, "alertes"],
    ["Vies sauvées (estimation)", livesSavedEstimate, "personnes"],
    ["Temps de réponse moyen", avgResponseTimeMinutes, "minutes"],
    ["Stocks critiques", criticalStocksCount, "stocks"],
    ["Structures en attente de validation", pendingStructuresValue, "structures"],
    ["", "", ""],
    ["INDICATEURS CALCULÉS", "", ""],
    ["Taux de couverture nationale", `${coverageRate}%`, ""],
    ["Efficacité alertes (dons/alertes)", `${alertEfficiency}%`, ""],
  ]);

  // Largeur des colonnes
  kpiSheet["!cols"] = [{ wch: 45 }, { wch: 20 }, { wch: 15 }];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, kpiSheet, "KPIs Vita-Link");

  writeFile(wb, `VitaLink_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
}