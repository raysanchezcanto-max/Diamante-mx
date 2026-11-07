"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTeamDisplayName, getTeamLogo } from "@/lib/teamLogos";
import { LMB_SERIE_DEL_REY_2026_STATS } from "@/lib/lmbSerieDelReyStats";
import type {
  LmbPlayoffSeries,
  LmbSerieDelReyPitcherDecision,
} from "@/lib/lmbPostseason";

type Tab = "games" | "hitting" | "pitching";

// Retrato oficial LMB primero: varios lanzadores de la Serie del Rey no
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
    return <span className="mlbWsPlayerPhoto lmbWsPlayerPlaceholder" aria-label={`Sin foto disponible de ${name}`} />;
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

function TeamCell({ code, name }: { code: string; name: string }) {
  const logo = getTeamLogo("LMB", 0, name);
  return (
    <div className="mlbWsTeamCell" data-team={code}>
      {logo && <img className="mlbWsTeamLogo" src={logo} alt="" loading="lazy" />}
      <span>{getTeamDisplayName("LMB", name)}</span>
    </div>
  );
}

function Decision({
  label,
  pitcher,
  slot,
}: {
  label: string;
  pitcher?: LmbSerieDelReyPitcherDecision;
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
export default function LmbSerieDelReyDetails({
  series,
}: {
  series: LmbPlayoffSeries;
}) {
  const [tab, setTab] = useState<Tab>("games");
  const games = series.games ?? [];
  if (!games.length) return null;

  const teams = new Map(series.teams.map(team => [team.code, team.name]));

  return (
    <div className="mlbWorldSeriesDetailsContent lmbSerieDelReyDetailsContent">
      <div className="mlbWorldSeriesDetailTabs" role="tablist" aria-label="Detalle de la Serie del Rey">
        {([
          ["games", "PARTIDOS"],
          ["hitting", "BATEO"],
          ["pitching", "PITCHEO"],
        ] as const).map(([value, label]) => (
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
            const date = new Date(`${game.date}T12:00:00-06:00`);
            const awayWon = game.awayRuns > game.homeRuns;
            const winSlot = awayWon ? "away" : "home";
            const lossSlot = awayWon ? "home" : "away";
            return (
              <Link
                key={game.id}
                href={`/game/lmb/${game.id}`}
                className="mlbWorldSeriesResultGame lmbSerieDelReyGame"
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
                    <TeamCell code={game.awayCode} name={teams.get(game.awayCode) ?? game.awayCode} />
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
                    <TeamCell code={game.homeCode} name={teams.get(game.homeCode) ?? game.homeCode} />
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

      {tab === "hitting" && (
        <>
          <div className="mlbWsSwipeHint" aria-hidden="true">
            DESLIZA PARA VER MÁS <span>→</span>
          </div>
          <div className="mlbWsStatsTable" role="region" tabIndex={0} aria-label="Estadísticas de bateo de la Serie del Rey">
            <div className="mlbWsStatsHeader mlbWsHittingRow">
              <span>JUGADOR</span><span>EQUIPO</span><span>AVG</span><span>HR</span><span>H</span><span>RBI</span>
            </div>
            {LMB_SERIE_DEL_REY_2026_STATS.hitting.map(player => (
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

      {tab === "pitching" && (
        <>
          <div className="mlbWsSwipeHint" aria-hidden="true">
            DESLIZA PARA VER MÁS <span>→</span>
          </div>
          <div className="mlbWsStatsTable" role="region" tabIndex={0} aria-label="Estadísticas de pitcheo de la Serie del Rey">
            <div className="mlbWsStatsHeader mlbWsPitchingRow">
              <span>PITCHER</span><span>EQUIPO</span><span>W-L</span><span>ERA</span><span>SO</span><span>IP</span><span>SV</span>
            </div>
            {LMB_SERIE_DEL_REY_2026_STATS.pitching.map(player => (
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
