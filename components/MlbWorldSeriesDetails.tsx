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

                    <span>
                      {new Intl.DateTimeFormat(
                        "es-MX",
                        {
                          day: "numeric",
                          month: "short",
                          timeZone:
                            "America/Mexico_City",
                        }
                      ).format(
                        new Date(
                          seriesGame.gameDate
                        )
                      )}
                    </span>
                  </div>

                  <strong>
                    {seriesGame.final
                      ? "FINAL"
                      : seriesGame.live
                      ? "EN VIVO"
                      : "PROGRAMADO"}
                  </strong>
                </div>

                <div className="mlbWorldSeriesResultScore">
                  <div>
                    <span>
                      {seriesGame.away}
                    </span>

                    <strong
  className={
    seriesGame.final &&
    seriesGame.awayRuns !== undefined &&
    seriesGame.homeRuns !== undefined
      ? seriesGame.awayRuns >
        seriesGame.homeRuns
        ? "mlbWorldSeriesScoreWinner"
        : "mlbWorldSeriesScoreLoser"
      : ""
  }
>
  {seriesGame.awayRuns ?? "-"}
</strong>
                  </div>

                  <div>
                    <span>
                      {seriesGame.home}
                    </span>

                    <strong
  className={
    seriesGame.final &&
    seriesGame.awayRuns !== undefined &&
    seriesGame.homeRuns !== undefined
      ? seriesGame.homeRuns >
        seriesGame.awayRuns
        ? "mlbWorldSeriesScoreWinner"
        : "mlbWorldSeriesScoreLoser"
      : ""
  }
>
  {seriesGame.homeRuns ?? "-"}
</strong>
                  </div>
                </div>

               {seriesGame.final && (
  <div className="mlbWorldSeriesDecisions">
    {seriesGame.winningPitcher && (
      <div className="mlbWsDecision">
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
      <div className="mlbWsDecision">
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
      <div className="mlbWsDecision">
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
                <div className="mlbWsGameLinkHint">
  VER JUEGO →
</div>
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
