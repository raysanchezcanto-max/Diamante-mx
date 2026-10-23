import type {
  MlbPostseason,
  MlbPostseasonSeries,
  MlbPostseasonGameType,
} from "@/lib/mlbPostseason";

import { getTeamLogo } from "@/lib/teamLogos";

type MlbPostseasonCardMode =
  | "current"
  | "history";

function SeriesCard({
  series,
  compact = false,
}: {
  series: MlbPostseasonSeries;
  compact?: boolean;
}) {
  const teamALogo = getTeamLogo(
    "MLB",
    series.teamA.id,
    series.teamA.name
  );

  const teamBLogo = getTeamLogo(
    "MLB",
    series.teamB.id,
    series.teamB.name
  );

  const liveGame =
    series.games.find(
      (game) => game.live
    ) ?? null;

  const nextGame =
    series.games.find(
      (game) => !game.final
    ) ?? null;

  return (
    <div
      className={`mlbPostseasonSeriesCard ${
        compact
          ? "mlbPostseasonSeriesCardCompact"
          : ""
      }`}
    >
      <div className="mlbPostseasonSeriesTop">
        <strong>{series.title}</strong>

        {!compact && (
          <span>
            AL MEJOR DE{" "}
            {series.gamesInSeries}
          </span>
        )}
      </div>

      <div className="mlbPostseasonSeriesTeams">
  <div
    className={`mlbPostseasonSeriesTeam ${
      compact && series.winner
        ? series.winner.id ===
          series.teamA.id
          ? "mlbPostseasonSeriesTeamWinner"
          : "mlbPostseasonSeriesTeamLoser"
        : ""
    }`}
  >
    <div>
      {teamALogo && (
        <img
          src={teamALogo}
          alt=""
        />
      )}

      <span>
        {series.teamA.name}
      </span>
    </div>

    <strong>
      {series.teamA.wins}
    </strong>
  </div>

  <div
    className={`mlbPostseasonSeriesTeam ${
      compact && series.winner
        ? series.winner.id ===
          series.teamB.id
          ? "mlbPostseasonSeriesTeamWinner"
          : "mlbPostseasonSeriesTeamLoser"
        : ""
    }`}
  >
    <div>
      {teamBLogo && (
        <img
          src={teamBLogo}
          alt=""
        />
      )}

      <span>
        {series.teamB.name}
      </span>
    </div>

    <strong>
      {series.teamB.wins}
    </strong>
  </div>
</div>

      {!compact && (
        <div className="mlbPostseasonSeriesStatus">
          {series.winner ? (
            <strong>
              {series.winner.name} AVANZA
            </strong>
          ) : liveGame ? (
            <strong className="mlbPostseasonLive">
              <span
                className="livePulseDot"
                aria-hidden="true"
              />
              EN VIVO · JUEGO{" "}
              {liveGame.gameNumber}
            </strong>
          ) : nextGame ? (
            <>
              <span>
                PRÓXIMO · JUEGO{" "}
                {nextGame.gameNumber}
              </span>

              <strong>
                {new Intl.DateTimeFormat(
                  "es-MX",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                    timeZone:
                      "America/Mexico_City",
                  }
                ).format(
                  new Date(
                    nextGame.gameDate
                  )
                )}
              </strong>
            </>
          ) : (
            <span>
              SERIE EN DISPUTA
            </span>
          )}
        </div>
      )}

      
    </div>
  );
}

function phaseName(
  phase: MlbPostseasonGameType
) {
  if (phase === "F") {
    return "Wild Card";
  }

  if (phase === "D") {
    return "Series Divisionales";
  }

  return "Series de Campeonato";
}

export default function MlbPostseasonCard({
  postseason,
  mode = "current",
}: {
  postseason: MlbPostseason;
  mode?: MlbPostseasonCardMode;
}) {
  if (mode === "history") {
    const phases:
      MlbPostseasonGameType[] = [
        "L",
        "D",
        "F",
      ];

    return (
      <section className="section mlbPostseasonHistorySection">
        <details className="mlbPostseasonHistory">
          <summary>
            Camino a la Serie Mundial
          </summary>

          <div className="mlbPostseasonHistoryContent">
            {phases.map((phase) => {
              const phaseSeries =
                postseason.series.filter(
                  (series) =>
                    series.gameType ===
                    phase
                );

              if (
                phaseSeries.length === 0
              ) {
                return null;
              }

              return (
                <div
                  key={phase}
                  className="mlbPostseasonHistoryPhase"
                >
                  <div className="mlbPostseasonHistoryPhaseHeader">
                    <span>
                      {phaseName(phase)}
                    </span>
                  </div>

                  <div className="mlbPostseasonHistoryGrid">
                    {phaseSeries.map(
                      (series) => (
                        <SeriesCard
                          key={series.key}
                          series={series}
                          compact
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </section>
    );
  }

  if (!postseason.currentPhase) {
    return null;
  }

  const currentSeries =
    postseason.series.filter(
      (series) =>
        series.gameType ===
        postseason.currentPhase
    );

  if (currentSeries.length === 0) {
    return null;
  }

  const hasActiveSeries =
    currentSeries.some(
      (series) => !series.winner
    );

  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">
            POSTEMPORADA · MLB{" "}
            {postseason.year}
          </span>

          <h2>
            {
              postseason.currentPhaseTitle
            }
          </h2>
        </div>

        {hasActiveSeries && (
          <span className="liveDot">
            ● EN DISPUTA
          </span>
        )}
      </div>

      <div className="mlbPostseasonGrid">
        {currentSeries.map(
          (series) => (
            <SeriesCard
              key={series.key}
              series={series}
            />
          )
        )}
      </div>
    </section>
  );
}
