import { getMlbPlayState } from "@/lib/mlbLive";
import LiveGamePanel from "@/components/LiveGamePanel";
import AutoRefresh from "@/components/AutoRefresh";
import { getLmbPlayState } from "@/lib/lmbLive";
import BaseDiamond from "@/components/BaseDiamond";
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
function formatInningHalf(
  inningState?: string
) {
  if (!inningState) return "";

  const value = inningState.trim().toLowerCase();

  if (value === "top") return "ALTA";
  if (value === "bottom") return "BAJA";
  if (value === "middle") return "MEDIA";
  if (value === "end") return "FIN";

  return inningState.toUpperCase();
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
    league,
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

 const playState =
  !isLive
    ? null
    : league === "LMB"
      ? await getLmbPlayState(gameId)
      : league === "MLB"
        ? await getMlbPlayState(gameId)
        : null;

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
  const liveInningLabel =
  isLive && game.inning
    ? `${formatInningHalf(game.inningState)} ${game.inning}`
    : "";

  return (
    <main className="gamePage">
   <AutoRefresh
  enabled={!isFinal}
/>
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
          {!isFinal && (
          <section className="broadcastSection">
  <div className="broadcastHeader">
    <span className="eyebrow">
      TRANSMISIÓN
    </span>

    <h2>Dónde ver</h2>
  </div>

  {broadcasts.length > 0 ? (
  <div className="broadcastLinks">
    {broadcasts.map((broadcast, index) =>
      broadcast.url ? (
        <a
          key={`${broadcast.name}-${index}`}
          href={broadcast.url}
          target="_blank"
          rel="noopener noreferrer"
          className="watchButton"
        >
         {broadcast.fallback
  ? `Ver opciones para ${broadcast.name}`
  : `Ver en ${broadcast.name}`}
        </a>
      ) : (
        <span
          key={`${broadcast.name}-${index}`}
          className="watchButtonDisabled"
        >
          {broadcast.name}
        </span>
      )
    )}
  </div>
) : (
  <div className="broadcastEmpty">
    Transmisión por confirmar
  </div>
)}
</section>
      )}

          <span
            className={
              isLive
                ? "gameDetailStatus live"
                : "gameDetailStatus"
            }
          >
          {isLive
  ? "● EN VIVO"
  : isFinal
    ? "FINAL"
    : game.detailedState
        ?.toLowerCase() ===
        "scheduled"
      ? "PROGRAMADO"
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
  {isFinal ? (
    <span>FINAL</span>
  ) : !isLive ? (
    <strong>VS</strong>
  ) : null}
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
      {isLive &&
  playState &&
  Array.isArray(playState.inningLines) &&
  playState.inningLines.length > 0 &&
  playState.lineScoreTotals && (
    <section
      style={{
        marginBottom: "24px",
        padding: "14px 18px",
        border: "1px solid #24452f",
        borderRadius: "16px",
        background: "#0b1c16",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: "#caff33",
        }}
      >
        LÍNEA DEL JUEGO
      </div>

   <div
  style={{
    overflowX: "auto",
  }}
>
  <div
    style={{
      minWidth: "760px",
      display: "grid",
      gridTemplateColumns:
        "220px repeat(9, 42px) 1px repeat(3, 48px)",
      alignItems: "center",
      columnGap: "6px",
      fontSize: "13px",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {/* ENCABEZADOS */}
    <div
      style={{
        padding: "8px 10px",
        color: "#9fb1ab",
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing: "0.06em",
      }}
    >
      EQUIPO
    </div>

    {Array.from({ length: 9 }, (_, index) => (
      <div
        key={`header-${index + 1}`}
        style={{
          textAlign: "center",
          color: "#9fb1ab",
          fontWeight: 700,
        }}
      >
        {index + 1}
      </div>
    ))}

    <div
      style={{
        width: "1px",
        height: "24px",
        background: "#29463b",
      }}
    />

    <div
      style={{
        textAlign: "center",
        color: "#caff33",
        fontWeight: 900,
      }}
    >
      R
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#6dd5ff",
        fontWeight: 900,
      }}
    >
      H
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#ffb45c",
        fontWeight: 900,
      }}
    >
      E
    </div>

    {/* VISITANTE */}
    <div
      style={{
        padding: "10px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {game.away}
    </div>

    {Array.from({ length: 9 }, (_, index) => {
      const inning =
        playState.inningLines?.find(
          (line) => line.inning === index + 1
        );

      return (
        <div
          key={`away-${index + 1}`}
          style={{
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {inning?.away ?? "–"}
        </div>
      );
    })}

    <div
      style={{
        width: "1px",
        height: "28px",
        background: "#29463b",
      }}
    />

    <div
      style={{
        textAlign: "center",
        color: "#caff33",
        fontWeight: 900,
      }}
    >
      {playState.lineScoreTotals.away.runs}
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#6dd5ff",
        fontWeight: 800,
      }}
    >
      {playState.lineScoreTotals.away.hits}
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#ffb45c",
        fontWeight: 800,
      }}
    >
      {playState.lineScoreTotals.away.errors}
    </div>

    {/* LOCAL */}
    <div
      style={{
        padding: "10px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {game.home}
    </div>

    {Array.from({ length: 9 }, (_, index) => {
      const inning =
        playState.inningLines?.find(
          (line) => line.inning === index + 1
        );

      return (
        <div
          key={`home-${index + 1}`}
          style={{
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {inning?.home ?? "–"}
        </div>
      );
    })}

    <div
      style={{
        width: "1px",
        height: "28px",
        background: "#29463b",
      }}
    />

    <div
      style={{
        textAlign: "center",
        color: "#caff33",
        fontWeight: 900,
      }}
    >
      {playState.lineScoreTotals.home.runs}
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#6dd5ff",
        fontWeight: 800,
      }}
    >
      {playState.lineScoreTotals.home.hits}
    </div>

    <div
      style={{
        textAlign: "center",
        color: "#ffb45c",
        fontWeight: 800,
      }}
    >
      {playState.lineScoreTotals.home.errors}
    </div>
  </div>
</div>
          style={{
borderCollapse: "collapse",
fontSize: "13px",
fontVariantNumeric: "tabular-nums",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 10px",
                  color: "#8fa9a0",
                  fontSize: "10px",
                }}
              >
                EQUIPO
              </th>

              {playState.inningLines.map((line) => (
                <th
                  key={line.inning}
                 style={{
width: "220px",
minWidth: "220px",
  textAlign: "left",
  padding: "7px 10px",
  color: "#9fb1ab",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.06em",
}}
    >               
                  {line.inning}
                </th>
              ))}

              <th style={{ padding: "6px 8px" }}>R</th>
              <th style={{ padding: "6px 8px" }}>H</th>
              <th style={{ padding: "6px 8px" }}>E</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px 10px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {game.away}
              </td>

              {playState.inningLines.map((line) => (
                <td
                  key={`away-${line.inning}`}
style={{
  padding: "7px 6px",
  color: "#9fb1ab",
  textAlign: "center",
  fontWeight: 700,
}}
                >
                  {line.away ?? "–"}
                </td>
              ))}

              <td
                style={{
                  textAlign: "center",
                  fontWeight: 800,
                  color: "#caff33",
                }}
              >
                {playState.lineScoreTotals.away.runs}
              </td>

              <td style={{ textAlign: "center" }}>
                {playState.lineScoreTotals.away.hits}
              </td>

              <td style={{ textAlign: "center" }}>
                {playState.lineScoreTotals.away.errors}
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "8px 10px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {game.home}
              </td>

              {playState.inningLines.map((line) => (
                <td
                  key={`home-${line.inning}`}
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {line.home ?? "–"}
                </td>
              ))}

              <td
                style={{
                  textAlign: "center",
                  fontWeight: 800,
                  color: "#caff33",
                }}
              >
                {playState.lineScoreTotals.home.runs}
              </td>

              <td style={{ textAlign: "center" }}>
                {playState.lineScoreTotals.home.hits}
              </td>

              <td style={{ textAlign: "center" }}>
                {playState.lineScoreTotals.home.errors}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
)}
    {isLive && playState && (
  <LiveGamePanel
  inning={
  playState.inning ??
  game.inning
}
inningState={
  playState.inningState ??
  game.inningState
}
    away={game.away}
home={game.home}
    first={playState.first}
    second={playState.second}
    third={playState.third}
    balls={playState.balls}
    strikes={playState.strikes}
    outs={playState.outs}
    description={playState.description}
    batterName={playState.batterName}
    pitcherName={playState.pitcherName}
pitchCount={playState.pitchCount}
inningLines={playState.inningLines}
lineScoreTotals={playState.lineScoreTotals}
    plays={playState.plays}
  
  />
)}
  

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
