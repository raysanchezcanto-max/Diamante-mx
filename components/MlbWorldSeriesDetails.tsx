"use client";

import { useState } from "react";
import Link from "next/link";

import type {
  MlbWorldSeries,
} from "@/lib/mlbWorldSeries";

import type {
  MlbWorldSeriesStats,
  MlbWorldSeriesHitter,
  MlbWorldSeriesPitcher,
} from "@/lib/mlbWorldSeriesStats";

import { getTeamLogo } from "@/lib/teamLogos";
const mexicoDateKey = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Mexico_City",
  }).format(date);
type Tab =
  | "games"
  | "hitting"
  | "pitching";

function PlayerPhoto({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <img
      className="mlbWsPlayerPhoto"
      src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${id}/headshot/67/current`}
      alt={name}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display =
          "none";
      }}
    />
  );
}

function TeamCell({
  teamId,
  team,
}: {
  teamId: number;
  team: string;
}) {
  const logo = getTeamLogo(
    "MLB",
    teamId,
    team
  );

  return (
    <div className="mlbWsTeamCell">
      {logo && (
        <img
          src={logo}
          alt=""
          className="mlbWsTeamLogo"
        />
      )}

      <span>{team}</span>
    </div>
  );
}

function HitterRow({
  player,
}: {
  player: MlbWorldSeriesHitter;
}) {
  return (
    <div className="mlbWsStatsRow mlbWsHittingRow">
      <div className="mlbWsPlayerCell">
        <PlayerPhoto
          id={player.id}
          name={player.name}
        />

        <strong>{player.name}</strong>
      </div>

      <TeamCell
        teamId={player.teamId}
        team={player.team}
      />

      <span>{player.avg}</span>
      <span>{player.homeRuns}</span>
      <span>{player.hits}</span>
      <span>{player.rbi}</span>
    </div>
  );
}

function PitcherRow({
  player,
}: {
  player: MlbWorldSeriesPitcher;
}) {
  return (
    <div className="mlbWsStatsRow mlbWsPitchingRow">
      <div className="mlbWsPlayerCell">
        <PlayerPhoto
          id={player.id}
          name={player.name}
        />

        <strong>{player.name}</strong>
      </div>

      <TeamCell
        teamId={player.teamId}
        team={player.team}
      />

      <span>
        {player.wins}-{player.losses}
      </span>

      <span>{player.era}</span>
      <span>{player.strikeOuts}</span>
      <span>{player.inningsPitched}</span>
      <span>{player.saves}</span>
    </div>
  );
}

export default function MlbWorldSeriesDetails({
  worldSeries,
  stats,
}: {
  worldSeries: MlbWorldSeries;
  stats: MlbWorldSeriesStats | null;
}) {
  const [tab, setTab] =
    useState<Tab>("games");

  return (
    <div className="mlbWorldSeriesDetailsContent">
      <div
        className="mlbWorldSeriesDetailTabs"
        role="tablist"
        aria-label="Detalle de la Serie Mundial"
      >
        <button
          type="button"
          className={
            tab === "games"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("games")
          }
        >
          PARTIDOS
        </button>

        <button
          type="button"
          className={
            tab === "hitting"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("hitting")
          }
        >
          BATEO
        </button>

        <button
          type="button"
          className={
            tab === "pitching"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("pitching")
          }
        >
          PITCHEO
        </button>
      </div>

      {tab === "games" && (
        <div className="mlbWorldSeriesResults">
          {worldSeries.games.map(
            (seriesGame) => (
              <Link
                key={seriesGame.id}
                href={`/game/mlb/${seriesGame.id}`}
                className="mlbWorldSeriesResultGame"
              >
                <div className="mlbWorldSeriesResultHeader">
                  <div>
                    <strong>
                      JUEGO{" "}
                      {
                        seriesGame.gameNumber
                      }
                    </strong>
    
            


<span className="mlbWsGameDate">
  {new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: "America/Mexico_City",
  })
    .format(new Date(seriesGame.gameDate))
    .toUpperCase()}

  {!seriesGame.final &&
  !seriesGame.live
    ? seriesGame.gameNumber === 7 &&
      worldSeries.teamA.wins === 3 &&
      worldSeries.teamB.wins === 3
      ? " · JUEGO DECISIVO"
      : seriesGame.gameNumber >= 5 &&
        seriesGame.gameNumber >
          4 + Math.min(
            worldSeries.teamA.wins,
            worldSeries.teamB.wins
          )
      ? " · SI ES NECESARIO"
      : seriesGame.gameNumber >= 5 &&
        Math.max(
          worldSeries.teamA.wins,
          worldSeries.teamB.wins
        ) === 3
      ? " · POSIBLE CIERRE"
      : ""
    : ""}
</span>


                  </div>

 
{seriesGame.final ? (
  <strong className="mlbWsStatusFinal">
    FINAL
  </strong>
) : seriesGame.firstPitchRecorded === true ? (
  <strong className="mlbWsStatusLive">
    EN VIVO
  </strong>
) : /warm[\s-]?up/i.test(
    seriesGame.detailedState ?? ""
  ) ||
  (seriesGame.firstPitchRecorded === false &&
    /^(live|in progress)$/i.test(
      seriesGame.status ?? ""
    )) ? (
  <strong
    className="mlbWsStatusToday"
    style={{ color: "#FF7A00" }}
  >
    POR COMENZAR
  </strong>
) : seriesGame.live ? (
  <strong className="mlbWsStatusLive">
    EN VIVO
  </strong>
) : mexicoDateKey(
    new Date(seriesGame.gameDate)
  ) === mexicoDateKey(new Date()) ? (
  <strong
    className="mlbWsStatusToday"
    style={{ color: "#38BDF8" }}
  >
    HOY
  </strong>

) : seriesGame.gameNumber <= 5 &&
  seriesGame.id ===
    worldSeries.games.find(
      (game) => !game.final
    )?.id ? (
  <strong className="mlbWsStatusConditional">
    PRÓXIMO
  </strong>
) : null}




                </div>

           
<div
  className="mlbWsResultMatchup"
  style={{
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) auto minmax(0, 1fr)",
    alignItems: "center",
    gap: "12px",
    marginTop: "16px",
  }}
>
  <div className="mlbWsResultMatchupTeam">
    <TeamCell
      teamId={seriesGame.awayId}
      team={seriesGame.away}
    />
  </div>

 
<div className="mlbWsResultMatchupNumbers">
  {!seriesGame.live && !seriesGame.final ? (
    <strong
      style={{
       fontSize: "22px",
        fontWeight: 800,
        color: "rgba(255,255,255,0.94)",
      }}
    >
      {new Intl.DateTimeFormat("es-MX", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Mexico_City",
      }).format(new Date(seriesGame.gameDate))}
    </strong>
  ) : (
    <>
      <strong
        className={
          seriesGame.final &&
          seriesGame.awayRuns !== undefined &&
          seriesGame.homeRuns !== undefined
            ? seriesGame.awayRuns > seriesGame.homeRuns
              ? "mlbWorldSeriesScoreWinner"
              : "mlbWorldSeriesScoreLoser"
            : ""
        }
      >
        {seriesGame.awayRuns ?? 0}
      </strong>

      <span>–</span>

      <strong
        className={
          seriesGame.final &&
          seriesGame.awayRuns !== undefined &&
          seriesGame.homeRuns !== undefined
            ? seriesGame.homeRuns > seriesGame.awayRuns
              ? "mlbWorldSeriesScoreWinner"
              : "mlbWorldSeriesScoreLoser"
            : ""
        }
      >
        {seriesGame.homeRuns ?? 0}
      </strong>
    </>
  )}
</div>


  <div className="mlbWsResultMatchupTeam">
    <TeamCell
      teamId={seriesGame.homeId}
      team={seriesGame.home}
    />
  </div>
</div>

    
{!seriesGame.final && !seriesGame.live && (
  <div className="mlbWsScheduledInfo">
    {seriesGame.venueName && (
  <div
    className="mlbWsScheduledMeta"
    style={{ justifyContent: "center" }}
  >
    <span style={{ textAlign: "center" }}>
      {seriesGame.venueName}
    </span>
  </div>
)}

    {(seriesGame.awayProbablePitcher ||
      seriesGame.homeProbablePitcher) && (
      <div className="mlbWsScheduledPitchers">
        <div>
          <span>
            P. PROBABLE ·{" "}
            {seriesGame.away
              .split(" ")
              .slice(-1)[0]
              .toUpperCase()}
          </span>

          <div className="mlbWsDecisionPlayer">
            {seriesGame.awayProbablePitcher && (
              <PlayerPhoto
                id={seriesGame.awayProbablePitcher.id}
                name={seriesGame.awayProbablePitcher.name}
              />
            )}

            <strong
              className={
                !seriesGame.awayProbablePitcher
                  ? "mlbWsPitcherPending"
                  : ""
              }
            >
              {seriesGame.awayProbablePitcher?.name ??
                "Por confirmar"}
            </strong>
          </div>
        </div>

        <div>
          <span>
            P. PROBABLE ·{" "}
            {seriesGame.home
              .split(" ")
              .slice(-1)[0]
              .toUpperCase()}
          </span>

          <div className="mlbWsDecisionPlayer">
            {seriesGame.homeProbablePitcher && (
              <PlayerPhoto
                id={seriesGame.homeProbablePitcher.id}
                name={seriesGame.homeProbablePitcher.name}
              />
            )}

            <strong
              className={
                !seriesGame.homeProbablePitcher
                  ? "mlbWsPitcherPending"
                  : ""
              }
            >
              {seriesGame.homeProbablePitcher?.name ??
                "Por confirmar"}
            </strong>
          </div>
        </div>
      </div>
    )}
  </div>
)}


{seriesGame.live &&
  (seriesGame.awayStartingPitcher ||
    seriesGame.homeStartingPitcher) && (
    <div className="mlbWsScheduledPitchers">
      <div>
        <span>
          ABRIDOR ·{" "}
          {seriesGame.away
            .split(" ")
            .slice(-1)[0]
            .toUpperCase()}
        </span>

        <div className="mlbWsDecisionPlayer">
          {seriesGame.awayStartingPitcher && (
            <PlayerPhoto
              id={seriesGame.awayStartingPitcher.id}
              name={seriesGame.awayStartingPitcher.name}
            />
          )}
          <strong>
            {seriesGame.awayStartingPitcher?.name ??
              "Por confirmar"}
          </strong>
        </div>
      </div>

      <div>
        <span>
          ABRIDOR ·{" "}
          {seriesGame.home
            .split(" ")
            .slice(-1)[0]
            .toUpperCase()}
        </span>

        <div className="mlbWsDecisionPlayer">
          {seriesGame.homeStartingPitcher && (
            <PlayerPhoto
              id={seriesGame.homeStartingPitcher.id}
              name={seriesGame.homeStartingPitcher.name}
            />
          )}
          <strong>
            {seriesGame.homeStartingPitcher?.name ??
              "Por confirmar"}
          </strong>
        </div>
      </div>
    </div>
  )}

               {seriesGame.final && (
  <div className="mlbWorldSeriesDecisions">
    {seriesGame.winningPitcher && (
      
<div
  className={
    (seriesGame.awayRuns ?? 0) >
    (seriesGame.homeRuns ?? 0)
      ? "mlbWsDecision mlbWsDecisionAway"
      : "mlbWsDecision mlbWsDecisionHome"
  }
>

        <span>GANADOR</span>

        <div className="mlbWsDecisionPlayer">
          <PlayerPhoto
            id={
              seriesGame
                .winningPitcher.id
            }
            name={
              seriesGame
                .winningPitcher.name
            }
          />

          <strong>
            {
              seriesGame
                .winningPitcher.name
            }
          </strong>
        </div>
      </div>
    )}

    {seriesGame.losingPitcher && (
      
<div
  className={
    (seriesGame.awayRuns ?? 0) >
    (seriesGame.homeRuns ?? 0)
      ? "mlbWsDecision mlbWsDecisionHome"
      : "mlbWsDecision mlbWsDecisionAway"
  }
>

        <span>PERDEDOR</span>

        <div className="mlbWsDecisionPlayer">
          <PlayerPhoto
            id={
              seriesGame
                .losingPitcher.id
            }
            name={
              seriesGame
                .losingPitcher.name
            }
          />

          <strong>
            {
              seriesGame
                .losingPitcher.name
            }
          </strong>
        </div>
      </div>
    )}

    {seriesGame.savePitcher && (
      
<div className="mlbWsDecision mlbWsDecisionSave">

        <span>SALVAMENTO</span>

        <div className="mlbWsDecisionPlayer">
          <PlayerPhoto
            id={
              seriesGame
                .savePitcher.id
            }
            name={
              seriesGame
                .savePitcher.name
            }
          />

          <strong>
            {
              seriesGame
                .savePitcher.name
            }
          </strong>
        </div>
      </div>
    )}
  </div>
)}
                {seriesGame.live && (
  <div className="mlbWsGameLinkHint">
    VER JUEGO EN VIVO →
  </div>
)}
</Link>
)
)}
</div>
)}
      {tab === "hitting" && (
        <>
          {stats &&
          stats.hitting.length > 0 ? (
            <div className="mlbWsStatsTable">
              <div className="mlbWsStatsHeader mlbWsHittingRow">
                <span>JUGADOR</span>
                <span>EQUIPO</span>
                <span>AVG</span>
                <span>HR</span>
                <span>H</span>
                <span>RBI</span>
              </div>

              {stats.hitting.map(
                (player) => (
                  <HitterRow
                    key={player.id}
                    player={player}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mlbWsStatsEmpty">
              Las estadísticas de bateo
              aparecerán cuando haya
              actividad en la Serie
              Mundial.
            </div>
          )}
        </>
      )}

      {tab === "pitching" && (
        <>
          {stats &&
          stats.pitching.length > 0 ? (
            <div className="mlbWsStatsTable">
              <div className="mlbWsStatsHeader mlbWsPitchingRow">
                <span>PITCHER</span>
                <span>EQUIPO</span>
                <span>W-L</span>
                <span>ERA</span>
                <span>SO</span>
                <span>IP</span>
                <span>SV</span>
              </div>

              {stats.pitching.map(
                (player) => (
                  <PitcherRow
                    key={player.id}
                    player={player}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mlbWsStatsEmpty">
              Las estadísticas de pitcheo
              aparecerán cuando haya
              actividad en la Serie
              Mundial.
            </div>
          )}
        </>
      )}
    </div>
  );
}
