import { getGameBroadcasts } from "@/lib/broadcasts";
import { notFound } from "next/navigation";

import {
  getGameDetails,
} from "@/lib/gameDetails";

import {
  getTeamLogo,
  type LeagueCode,
} from "@/lib/teamLogos";

type GamePageProps = {
  params: Promise<{
    league: string;
    id: string;
  }>;
};

function isLeagueCode(
  value: string
): value is LeagueCode {
  return (
    value === "MLB" ||
    value === "LMB" ||
    value === "LMP"
  );
}

function formatGameDate(
  startTime: string
) {
  if (!startTime) {
    return "Fecha por confirmar";
  }

  const gameDate = new Date(startTime);

  const dateKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const today = new Date();

  const tomorrow = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  if (
    dateKey(gameDate) ===
    dateKey(today)
  ) {
    return "Hoy";
  }

  if (
    dateKey(gameDate) ===
    dateKey(tomorrow)
  ) {
    return "Mañana";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      timeZone: "America/Mexico_City",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(gameDate);
}

function formatGameTime(
  startTime: string,
  league: LeagueCode
) {
  if (!startTime) {
    return "Hora por confirmar";
  }

  const dateKey =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date(startTime)
    );

  if (
    league === "LMP" &&
    dateKey === "2026-10-13"
  ) {
    return "Hora por confirmar";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      timeZone: "America/Mexico_City",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    new Date(startTime)
  );
}
export default async function GamePage({
  params,
}: GamePageProps) {
  const {
    league: rawLeague,
    id: rawId,
  } = await params;

  const league =
    rawLeague.toUpperCase();

  if (!isLeagueCode(league)) {
    notFound();
  }

  const gameId =
    Number(rawId);

  if (!Number.isFinite(gameId)) {
    notFound();
  }

  const game =
    await getGameDetails(
      league,
      gameId
    );

  if (!game) {
    notFound();
  }
  const broadcasts =
  await getGameBroadcasts(
    leagueCode,
    gameId
  );

  const awayLogo =
    getTeamLogo(
      league,
      game.awayId,
      game.away
    );

  const homeLogo =
    getTeamLogo(
      league,
      game.homeId,
      game.home
    );

  const isFinal =
    game.status === "Final";

  const isLive =
    game.status === "Live";

  const hasScore =
    game.awayRuns !== undefined &&
    game.homeRuns !== undefined;

  const date =
    formatGameDate(
      game.startTime
    );

  const time =
    formatGameTime(
      game.startTime,
      league
    );
  <section className="broadcastSection">
  <div className="broadcastHeader">
    <span className="eyebrow">
      TRANSMISIÓN
    </span>

    <h2>Dónde ver</h2>
  </div>

  {broadcasts.length > 0 ? (
    <div className="broadcastGrid">
      {broadcasts.map(
        (broadcast, index) => (
          <div
            className="broadcastCard"
            key={`${broadcast.name}-${index}`}
          >
            <div>
              <span className="broadcastType">
                {broadcast.type}
              </span>

              <strong>
                {broadcast.name}
              </strong>
            </div>

            {broadcast.url && (
              <a
                href={broadcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="broadcastButton"
              >
                Ver en {broadcast.name}
              </a>
            )}
          </div>
        )
      )}
    </div>
  ) : (
    <div className="broadcastEmpty">
      Transmisión por confirmar
    </div>
  )}
</section>

  return (
    <main className="gamePage">
      <a
        className="gameBack"
        href={`/?league=${league.toLowerCase()}`}
      >
        ← Volver a {league}
      </a>

      <section className="gameHero">
        <div className="gameHeroTop">
          <div>
            <span className="eyebrow">
              {game.stage ??
                league}
            </span>

            <p className="gameMeta">
              {date} · {time}
            </p>

            <p className="gameVenue">
              {game.venue}
            </p>
          </div>
          <section className="broadcastSection">
  <div className="broadcastHeader">
    <span className="eyebrow">
      TRANSMISIÓN
    </span>

    <h2>Dónde ver</h2>
  </div>

  {broadcasts.length > 0 ? (
    <div className="broadcastGrid">
      {broadcasts.map((broadcast, index) => (
        <div
          className="broadcastCard"
          key={`${broadcast.name}-${index}`}
        >
          <div>
            <span className="broadcastType">
              {broadcast.type}
            </span>

            <strong>
              {broadcast.name}
            </strong>
          </div>

          {broadcast.url && (
            <a
              href={broadcast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="broadcastButton"
            >
              Ver en {broadcast.name}
            </a>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="broadcastEmpty">
      Transmisión por confirmar
    </div>
  )}
</section>

          <span
            className={
              isLive
                ? "gameDetailStatus live"
                : "gameDetailStatus"
            }
          >
            {isLive
              ? `● EN VIVO${
                  game.inning
                    ? ` · ${
                        game.inningState ??
                        ""
                      } ${
                        game.inning
                      }`
                    : ""
                }`
              : isFinal
                ? "FINAL"
                : game.detailedState}
          </span>
        </div>

        <div className="matchup">
          <div className="matchupTeam">
            {awayLogo && (
              <img
                src={awayLogo}
                alt={`Logo de ${game.away}`}
                width={96}
                height={96}
              />
            )}

            <h1>
              {game.away}
            </h1>

            {hasScore ? (
              <strong className="matchupScore">
                {game.awayRuns}
              </strong>
            ) : null}
          </div>

          <div className="matchupCenter">
            {hasScore ? (
              <span>
                {isFinal
                  ? "FINAL"
                  : isLive
                    ? "EN VIVO"
                    : ""}
              </span>
            ) : (
              <strong>VS</strong>
            )}
          </div>

          <div className="matchupTeam">
            {homeLogo && (
              <img
                src={homeLogo}
                alt={`Logo de ${game.home}`}
                width={96}
                height={96}
              />
            )}

            <h1>
              {game.home}
            </h1>

            {hasScore ? (
              <strong className="matchupScore">
                {game.homeRuns}
              </strong>
            ) : null}
          </div>
        </div>
      </section>

      <section className="gameInfo">
        <span className="eyebrow">
          INFORMACIÓN DEL PARTIDO
        </span>

        <div className="gameInfoGrid">
          <div>
            <small>Competencia</small>
            <strong>
              {game.stage ??
                league}
            </strong>
          </div>

          <div>
            <small>Fecha</small>
            <strong>
              {date}
            </strong>
          </div>

          <div>
            <small>Hora</small>
            <strong>
              {time}
            </strong>
          </div>

          <div>
            <small>Estadio</small>
            <strong>
              {game.venue}
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}
