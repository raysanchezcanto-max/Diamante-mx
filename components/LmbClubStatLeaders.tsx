"use client";

import { useId, useState } from "react";
import type { LmbClubStatLeaders } from "@/lib/lmbClubLeaders";

type Props = {
  clubName: string;
  data: LmbClubStatLeaders;
};

export default function LmbClubStatLeaders({ clubName, data }: Props) {
  const [category, setCategory] = useState<"bateo" | "pitcheo">("bateo");
  const baseId = useId();
  const batting = category === "bateo";
  const items = batting ? data.batting : data.pitching;

  return (
    <section className="clubPanel clubMiniLeaders" aria-label={`Estadísticas de ${clubName}`}>
      <span className="clubKicker">DESTACADOS DEL EQUIPO · {data.season}</span>
      <h2>Estadísticas</h2>
      <div className="clubLeaderTabs" role="tablist" aria-label="Tipo de estadísticas">
        <button
          type="button"
          className="clubLeaderTab"
          role="tab"
          id={`${baseId}-bateo`}
          aria-controls={`${baseId}-panel`}
          aria-selected={batting}
          onClick={() => setCategory("bateo")}
        >
          Bateo
        </button>
        <button
          type="button"
          className="clubLeaderTab"
          role="tab"
          id={`${baseId}-pitcheo`}
          aria-controls={`${baseId}-panel`}
          aria-selected={!batting}
          onClick={() => setCategory("pitcheo")}
        >
          Pitcheo
        </button>
      </div>
      <div
        className="clubLeaderPanel"
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${category}`}
      >
        {items.length ? (
          items.map((item) => (
            <div className="clubLeaderRow" key={item.metric}>
              <span className="clubLeaderMetric">{item.metric}</span>
              <a
                className="clubLeaderName"
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ver ficha LMB de ${item.name}`}
              >
                {item.name} ↗
              </a>
              <span className="clubLeaderNumber">
                <strong>{item.value}</strong>
                <small>{item.unit}</small>
              </span>
            </div>
          ))
        ) : (
          <p className="clubSmallNote">
            No hay estadísticas individuales verificables de {batting ? "bateo" : "pitcheo"}
            {" "}para este club y temporada en la fuente consultada.
          </p>
        )}
        <p className="clubSmallNote clubLeadersNote">
          Selección por categoría calculada con registros oficiales de LMB {data.season}
          {" "}correspondientes a {clubName}. Promedio de bateo: mínimo 100 turnos;
          efectividad: mínimo 30 entradas lanzadas. Es archivo de temporada,
          no una clasificación en vivo ni un roster actual.
        </p>
      </div>
    </section>
  );
}
