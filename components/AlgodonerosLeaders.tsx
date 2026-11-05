"use client";

import { useState, type KeyboardEvent } from "react";

type Category = "bateo" | "pitcheo";
type StatLine = {
  metric: string;
  name: string;
  value: string;
  unit: string;
  source?: string;
};

// Bateo: las cinco categorías publicadas en la ficha oficial del club 2026.
const BATTING: StatLine[] = [
  { metric: "Porcentaje de bateo", name: "Albert Lara", value: ".344", unit: "AVG", source: "https://lmb.com.mx/jugador/804107" },
  { metric: "Jonrones", name: "Mason Martin", value: "18", unit: "HR", source: "https://lmb.com.mx/jugador/676733" },
  { metric: "Carreras producidas", name: "Mason Martin", value: "68", unit: "RBI", source: "https://lmb.com.mx/jugador/676733" },
  { metric: "Carreras anotadas", name: "Albert Lara", value: "68", unit: "R", source: "https://lmb.com.mx/jugador/804107" },
  { metric: "Bases robadas", name: "Albert Lara", value: "10", unit: "SB", source: "https://lmb.com.mx/jugador/804107" },
];

// Pitcheo: cifras verificadas en las fichas INDIVIDUALES de LMB 2026.
// No se atribuye un primer lugar por categoría sin verificar el ranking completo.
const PITCHING: StatLine[] = [
  {
    metric: "Efectividad · 45.2 entradas",
    name: "Thomas McIlraith",
    value: "1.97",
    unit: "ERA",
    source: "https://lmb.com.mx/jugador/641852",
  },
  {
    metric: "Juegos ganados",
    name: "Touki Toussaint",
    value: "5",
    unit: "W",
    source: "https://lmb.com.mx/jugador/657053",
  },
  {
    metric: "Ponches",
    name: "Touki Toussaint",
    value: "65",
    unit: "SO",
    source: "https://lmb.com.mx/jugador/657053",
  },
  {
    metric: "Salvamentos",
    name: "Matt Foster",
    value: "18",
    unit: "SV",
    source: "https://lmb.com.mx/jugador/641582",
  },
];

export default function AlgodonerosLeaders() {
  const [category, setCategory] = useState<Category>("bateo");
  const batting = category === "bateo";
  const items = batting ? BATTING : PITCHING;
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs || tabs.length !== 2) return;
    const index = category === "bateo" ? 0 : 1;
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % 2
      : event.key === "ArrowLeft" ? (index + 1) % 2
      : event.key === "Home" ? 0
      : event.key === "End" ? 1
      : null;
    if (nextIndex === null) return;
    event.preventDefault();
    setCategory(nextIndex === 0 ? "bateo" : "pitcheo");
    tabs[nextIndex]?.focus();
  };

  return (
    <section className="clubPanel clubMiniLeaders" aria-label="Estadísticas de Algodoneros">
      <span className="clubKicker">LÍDERES Y DESTACADOS DEL EQUIPO · 2026</span>
      <h2>Estadísticas</h2>
      <div className="clubLeaderTabs" role="tablist" aria-label="Tipo de estadísticas">
        <button
          type="button"
          id="algodoneros-tab-bateo"
          className="clubLeaderTab"
          role="tab"
          aria-controls="algodoneros-panel"
          aria-selected={batting}
          tabIndex={batting ? 0 : -1}
          onKeyDown={onTabKeyDown}
          onClick={() => setCategory("bateo")}
        >
          Bateo
        </button>
        <button
          type="button"
          id="algodoneros-tab-pitcheo"
          className="clubLeaderTab"
          role="tab"
          aria-controls="algodoneros-panel"
          aria-selected={!batting}
          tabIndex={batting ? -1 : 0}
          onKeyDown={onTabKeyDown}
          onClick={() => setCategory("pitcheo")}
        >
          Pitcheo
        </button>
      </div>
      <div
        className="clubLeaderPanel"
        id="algodoneros-panel"
        role="tabpanel"
        aria-labelledby={batting ? "algodoneros-tab-bateo" : "algodoneros-tab-pitcheo"}
      >
        {items.map(item => (
          <div className="clubLeaderRow" key={item.metric}>
            <span className="clubLeaderMetric">{item.metric}</span>
            {item.source ? (
              <a className="clubLeaderName" href={item.source} target="_blank" rel="noopener noreferrer" title={"Ver estadísticas oficiales de " + item.name}>
                {item.name} ↗
              </a>
            ) : (
              <strong className="clubLeaderName">{item.name}</strong>
            )}
            <span className="clubLeaderNumber">
              <strong>{item.value}</strong>
              <small>{item.unit}</small>
            </span>
          </div>
        ))}
        <p className="clubSmallNote clubLeadersNote">
          Selección de estadísticas individuales verificadas de LMB 2026.
          Son registros históricos del equipo, no un roster actual ni datos en vivo.
          {!batting && " Los destacados de pitcheo no representan un ranking completo de todos los lanzadores."}
        </p>
      </div>
    </section>
  );
}
