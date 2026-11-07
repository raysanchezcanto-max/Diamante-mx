"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTeamDisplayName, getTeamLogo } from "@/lib/teamLogos";
import type { LmpFinalDetails } from "@/lib/lmpFinalDetails";
import type { LmpFinalDecision } from "@/lib/lmpFinalDetails";

type Tab = "games" | "hitting" | "pitching";

// Retrato oficial LMP primero: varios lanzadores de la Serie Final no
// tienen headshot MLB /67/current pero sí /headshot/milb/current.
// Preservar el estilo visual MLB, con respaldo limpio cuando ninguna fuente existe.
function PlayerPhoto({ id, name }: { id: number; name: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [id]);

  const sources = [
    `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_180/v1/people/${id}/headshot/milb/current`,
    `https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${id}/headshot/67/current`,
  ];

  if (sourceIndex >= sources.length) {
    return <span className="mlbWsPlayerPhoto lmpWsPlayerPlaceholder" aria-label={`Sin foto disponible de ${name}`} />;
  }
  return (
    <img
      key={`${id}-${sourceIndex}`}
      className="mlbWsPlayerPhoto"
      src={sources[sourceIndex]}
      alt={name}
      loading="lazy"
      onError={() => setSourceIndex(index => Math.min(index + 1, sources.length))}
    />
  );
}

function TeamCell({ code, name }: { code: number; name: string }) {
  const logo = getTeamLogo("LMP", code, name);
  return (
    <div className="mlbWsTeamCell" data-team={code}>
      {logo && <img className="mlbWsTeamLogo" src={logo} alt="" loading="lazy" />}
      <span>{getTeamDisplayName("LMP", name)}</span>
    </div>
  );
}

function Decision({
  label,
  pitcher,
  slot,
}: {
  label: string;
  pitcher?: LmpFinalDecision;
  slot: "away" | "home" | "save";
}) {
  if (!pitcher) return null;
  return (
    <div
      className={`mlbWsDecision ${slot === "save"
        ? "mlbWsDecisionSave"
        : slot === "away"
          ? "mlbWsDecisionAway"
          : "mlbWsDecisionHome"}`}
    >
      <span>{label}</span>
      <div className="mlbWsDecisionPlayer">
        <PlayerPhoto id={pitcher.id} name={pitcher.name} />
        <strong>{pitcher.name}</strong>
      </div>
    </div>
  );
}

/** Réplica de presentación MLB: partidos, bateo y pitcheo con datos 2026 oficiales. */
export default function LmpSerieFinalDetails({
  details,
}: {
  details: LmpFinalDetails;
}) {
  const [tab, setTab] = useState<Tab>("games");
  const games = details.games ?? [];
  if (!games.length) return null;

  const teams = new Map(details.teams.map(team => [team.id, team.name]));

  return (
    <div className="mlbWorldSeriesDetailsContent lmpSerieFinalDetailsContent">
      <div className="mlbWorldSeriesDetailTabs" role="tablist" aria-label="Detalle de la Serie Final">
        {([
          ["games", "PARTIDOS"],
          ["hitting", "BATEO"],
          ["pitching", "PITCHEO"],
        ] as const).filter(([value]) => value === "games" || Boolean(details.stats)).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={tab === value ? "active" : ""}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "games" && (
        <div className="mlbWorldSeriesResults">
          {games.map((game, index) => {
            const date = new Date(game.date);
            const awayWon = game.awayRuns > game.homeRuns;
            const winSlot = awayWon ? "away" : "home";
            const lossSlot = awayWon ? "home" : "away";
            return (
              <Link
                key={game.id}
                href={`/game/lmp/${game.id}`}
                className="mlbWorldSeriesResultGame lmpSerieFinalGame"
              >
                <div className="mlbWorldSeriesResultHeader">
                  <div>
                    <strong>JUEGO {index + 1}</strong>
                    <span className="mlbWsGameDate">
                      {new Intl.DateTimeFormat("es-MX", {
                        day: "numeric",
                        month: "short",
                        timeZone: "America/Mexico_City",
                      }).format(date).toUpperCase()}
                    </span>
                  </div>
                  <strong className="mlbWsStatusFinal">FINAL</strong>
                </div>

                <div className="mlbWsResultMatchup">
                  <div className="mlbWsResultMatchupTeam">
                    <TeamCell code={game.awayId} name={teams.get(game.awayId) ?? String(game.awayId)} />
                  </div>
                  <div className="mlbWsResultMatchupNumbers">
                    <strong className={awayWon ? "mlbWorldSeriesScoreWinner" : "mlbWorldSeriesScoreLoser"}>
                      {game.awayRuns}
                    </strong>
                    <span>–</span>
                    <strong className={!awayWon ? "mlbWorldSeriesScoreWinner" : "mlbWorldSeriesScoreLoser"}>
                      {game.homeRuns}
                    </strong>
                  </div>
                  <div className="mlbWsResultMatchupTeam">
                    <TeamCell code={game.homeId} name={teams.get(game.homeId) ?? String(game.homeId)} />
                  </div>
                </div>

                {(game.winner || game.loser || game.save) && (
                  <div className="mlbWorldSeriesDecisions">
                    <Decision label="GANADOR" pitcher={game.winner} slot={winSlot} />
                    <Decision label="PERDEDOR" pitcher={game.loser} slot={lossSlot} />
                    <Decision label="SALVAMENTO" pitcher={game.save} slot="save" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {tab === "hitting" && details.stats && (
        <>
          <div className="mlbWsSwipeHint" aria-hidden="true">
            DESLIZA PARA VER MÁS <span>→</span>
          </div>
          <div className="mlbWsStatsTable" role="region" tabIndex={0} aria-label="Estadísticas de bateo de la Serie Final">
            <div className="mlbWsStatsHeader mlbWsHittingRow">
              <span>JUGADOR</span><span>EQUIPO</span><span>AVG</span><span>HR</span><span>H</span><span>RBI</span>
            </div>
            {details.stats.hitting.map(player => (
              <div className="mlbWsStatsRow mlbWsHittingRow" key={player.id}>
                <div className="mlbWsPlayerCell">
                  <PlayerPhoto id={player.id} name={player.name} />
                  <strong>{player.name}</strong>
                </div>
                <TeamCell code={player.teamCode} name={player.team} />
                <span>{player.avg}</span>
                <span>{player.homeRuns}</span>
                <span>{player.hits}</span>
                <span>{player.rbi}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "pitching" && details.stats && (
        <>
          <div className="mlbWsSwipeHint" aria-hidden="true">
            DESLIZA PARA VER MÁS <span>→</span>
          </div>
          <div className="mlbWsStatsTable" role="region" tabIndex={0} aria-label="Estadísticas de pitcheo de la Serie Final">
            <div className="mlbWsStatsHeader mlbWsPitchingRow">
              <span>PITCHER</span><span>EQUIPO</span><span>W-L</span><span>ERA</span><span>SO</span><span>IP</span><span>SV</span>
            </div>
            {details.stats.pitching.map(player => (
              <div className="mlbWsStatsRow mlbWsPitchingRow" key={player.id}>
                <div className="mlbWsPlayerCell">
                  <PlayerPhoto id={player.id} name={player.name} />
                  <strong>{player.name}</strong>
                </div>
                <TeamCell code={player.teamCode} name={player.team} />
                <span>{player.wins}-{player.losses}</span>
                <span>{player.era}</span>
                <span>{player.strikeOuts}</span>
                <span>{player.inningsPitched}</span>
                <span>{player.saves}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
