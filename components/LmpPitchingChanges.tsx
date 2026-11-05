"use client";

import { useState } from "react";
import type { LmpPitchingChange } from "@/lib/lmpPitchingChanges";
import BaseballDecisionPhoto from "@/components/BaseballDecisionPhoto";

type Props = {
  changes: LmpPitchingChange[];
  away: string;
  home: string;
  awayLogo?: string | null;
  homeLogo?: string | null;
};

const VISIBLE_PER_TEAM = 3;

export default function LmpPitchingChanges({
  changes, away, home, awayLogo, homeLogo,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  if (changes.length === 0) return null;

  const teams = [
    { side: "away" as const, label: "VISITANTE", name: away, logo: awayLogo },
    { side: "home" as const, label: "LOCAL", name: home, logo: homeLogo },
  ];

  // Cada equipo muestra primero los relevos más recientes, sin alterar el feed.
  const showToggle = teams.some(
    (team) => changes.filter((change) => change.side === team.side).length > VISIBLE_PER_TEAM
  );

  return (
    <section className="baseballExtrasPanel lmpPitchingChanges" aria-label="Cambios de lanzador">
      <div className="lmpPitchingChangesHeader">
        <span className="eyebrow">CAMBIOS DE LANZADOR</span>
        <span className="lmpPitchingChangesCount">
          {changes.length} {changes.length === 1 ? "cambio registrado" : "cambios registrados"}
        </span>
      </div>

      <div className="lmpPitchingChangesColumns">
        {teams.map((team) => {
          const teamChanges = changes.filter((change) => change.side === team.side);
          const shown = (
            expanded ? teamChanges : teamChanges.slice(-VISIBLE_PER_TEAM)
          ).slice().reverse();

          return (
            <div className="lmpPitchingTeamColumn" key={team.side}>
              <header className="lmpPitchingTeamHeader">
                {team.logo && (
                  <img src={team.logo} alt="" width={36} height={36} loading="lazy" />
                )}
                <div className="lmpPitchingTeamIdentity">
                  <span className="lmpPitchingTeamSide">{team.label}</span>
                  <strong>{team.name}</strong>
                </div>
                <span className="lmpPitchingTeamCount">
                  {teamChanges.length} {teamChanges.length === 1 ? "cambio" : "cambios"}
                </span>
              </header>

              {teamChanges.length === 0 ? (
                <p className="lmpPitchingTeamEmpty">Sin relevos registrados.</p>
              ) : (
                <div className="lmpPitchingChangesList">
                  {shown.map((change) => (
                    <article className="lmpPitchingChange" key={change.id}>
                      <div className="lmpPitchingChangeHeading">
                        <span className="lmpPitchingChangeInning">
                          {change.half} {change.inning}
                        </span>
                      </div>
                      <div className="lmpPitchingChangePlayers">
                        <div>
                          <small>SALIÓ</small>
                          <div className="lmpPitchingChangePlayerIdentity">
                            <BaseballDecisionPhoto playerId={change.outId} league="LMP" />
                            <strong>{change.outName}</strong>
                          </div>
                        </div>
                        <span className="lmpPitchingChangeArrow" aria-hidden="true">→</span>
                        <div>
                          <small>ENTRÓ</small>
                          <div className="lmpPitchingChangePlayerIdentity">
                            <BaseballDecisionPhoto playerId={change.inId} league="LMP" />
                            <strong>{change.inName}</strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showToggle && (
        <button
          type="button"
          className="lmpPitchingChangesToggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded
            ? "Mostrar los tres últimos por equipo"
            : `Ver todos los cambios (${changes.length})`}
        </button>
      )}
    </section>
  );
}
