"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { ClubStatHighlight } from "@/lib/clubStatistics";

type Props = {
  clubName: string;
  batting: ClubStatHighlight[];
  pitching: ClubStatHighlight[];
};

export default function ClubStatisticsLeaders({ clubName, batting, pitching }: Props) {
  const [category, setCategory] = useState<"bateo" | "pitcheo">("bateo");
  const labelId = useId();
  const active = category === "bateo" ? batting : pitching;
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const order = ["bateo", "pitcheo"] as const;
    const position = category === "bateo" ? 0 : 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowLeft" ? 1 - position
      : event.key === "Home" ? 0 : event.key === "End" ? 1 : null;
    if (next === null) return;
    event.preventDefault();
    setCategory(order[next]);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return <section className="clubStatsLeaders" aria-label={`Líderes individuales de ${clubName}`}>
    <div className="clubBigLeaguesSectionHead">
      <span className="clubKicker">DESTACADOS INDIVIDUALES</span>
      <h3>Líderes del equipo</h3>
    </div>
    <div className="clubStatsLeadersTabs" role="tablist" aria-label="Categoría de estadísticas individuales">
      {(["bateo", "pitcheo"] as const).map(tab => <button key={tab} type="button"
        id={`${labelId}-${tab}`} role="tab" aria-controls={`${labelId}-panel`}
        aria-selected={category === tab} tabIndex={category === tab ? 0 : -1}
        onClick={() => setCategory(tab)} onKeyDown={onKeyDown}>
        {tab === "bateo" ? "Bateo" : "Pitcheo"}
      </button>)}
    </div>
    <div id={`${labelId}-panel`} role="tabpanel" aria-labelledby={`${labelId}-${category}`}
      className="clubStatsLeadersRows">
      {active.length ? active.map(row => <div className="clubStatsLeader" key={row.metric}>
        <span className="clubStatsLeaderMetric">{row.metric}</span>
        <a href={row.source} target="_blank" rel="noopener noreferrer">{row.name} ↗</a>
        <strong>{row.value} <small>{row.unit}</small></strong>
      </div>) : <p className="clubSmallNote">La fuente oficial no devolvió registros individuales
        verificables de {category} para este equipo y temporada.</p>}
    </div>
    <p className="clubSmallNote">Se selecciona el mejor registro de cada categoría entre los
      jugadores asociados a este club y temporada. Para el promedio se requieren al menos
      100 turnos y para la efectividad, 30 entradas. No es una clasificación general de la liga.</p>
  </section>;
}
