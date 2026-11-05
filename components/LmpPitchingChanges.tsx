"use client";

import { useState } from "react";
import type { LmpPitchingChange } from "@/lib/lmpPitchingChanges";

type Props = {
  changes: LmpPitchingChange[];
  away: string;
  home: string;
  awayLogo?: string | null;
  homeLogo?: string | null;
};

const VISIBLE_CHANGES = 3;

export default function LmpPitchingChanges({
  changes, away, home, awayLogo, homeLogo,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  if (changes.length === 0) return null;

  // Orden cronológico: los tres últimos inicialmente; ver todos a petición.
  const shown = expanded || changes.length <= VISIBLE_CHANGES
    ? changes : changes.slice(-VISIBLE_CHANGES);

  return (
    <section className="baseballExtrasPanel lmpPitchingChanges" aria-label="Cambios de lanzador">
      <div className="lmpPitchingChangesHeader">
        <span className="eyebrow">CAMBIOS DE LANZADOR</span>
        <span className="lmpPitchingChangesCount">
          {changes.length} {changes.length === 1 ? "cambio registrado" : "cambios registrados"}
        </span>
      </div>

      <div className="lmpPitchingChangesList">
        {shown.map((change) => {
          const name = change.side === "away" ? away : home;
          const logo = change.side === "away" ? awayLogo : homeLogo;

          return (
            <article className="lmpPitchingChange" key={change.id}>
              <div className="lmpPitchingChangeTeam">
                {logo && (
                  <img src={logo} alt="" width={28} height={28} loading="lazy" />
                )}
                <strong>{name}</strong>
                <span className="lmpPitchingChangeInning">
                  {change.half} {change.inning}
                </span>
              </div>
              <div className="lmpPitchingChangePlayers">
                <div>
                  <small>SALIÓ</small>
                  <strong>{change.outName}</strong>
                </div>
                <span className="lmpPitchingChangeArrow" aria-hidden="true">→</span>
                <div>
                  <small>ENTRÓ</small>
                  <strong>{change.inName}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {changes.length > VISIBLE_CHANGES && (
        <button
          type="button"
          className="lmpPitchingChangesToggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded
            ? "Mostrar los tres últimos"
            : `Ver todos los cambios (${changes.length})`}
        </button>
      )}
    </section>
  );
}
