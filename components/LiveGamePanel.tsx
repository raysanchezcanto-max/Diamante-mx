import BaseDiamond from "./BaseDiamond";
import { getLmpInningLabel } from "@/lib/lmpInningLabel";

type LiveGamePanelProps = {
  warmup?: boolean;
  lmpMode?: boolean;
  away: string;
home: string;
  inning?: number;
  inningState?: string;

  first?: number;
  second?: number;
  third?: number;

  balls?: number;
  strikes?: number;
  outs?: number;

  description?: string;
  batterName?: string;
  pitcherName?: string;
pitchCount?: number;
  inningLines?: {
  inning: number;
  away?: number;
  home?: number;
}[];

lineScoreTotals?: {
  away: {
    runs: number;
    hits: number;
    errors: number;
  };
  home: {
    runs: number;
    hits: number;
    errors: number;
  };
};
  plays?: string[];
};

function formatInningState(
  value?: string
) {
  const normalized =
    value?.trim().toLowerCase() ?? "";

  if (
    normalized.includes("top") ||
    normalized.includes("alta")
  ) {
    return "ALTA";
  }

  if (
    normalized.includes("bottom") ||
    normalized.includes("baja")
  ) {
    return "BAJA";
  }

  if (
    normalized === "middle" ||
    normalized === "mitad"
  ) {
    return "BAJA";
  }

  if (
    normalized === "end" ||
    normalized === "fin"
  ) {
    return "ALTA";
  }

  return value?.toUpperCase() ?? "";
}

export default function LiveGamePanel({
  warmup = false,
  lmpMode = false,
  inning,
  inningState,
  away,
  home,
  first = 0,
  second = 0,
  third = 0,
  balls = 0,
  strikes = 0,
  outs = 0,
 description,
batterName,
pitcherName,
pitchCount,
  inningLines = [],
lineScoreTotals,
plays = [],
}: LiveGamePanelProps) {
 const formattedInningState =
  formatInningState(inningState);
const normalizedInningState =
  inningState?.trim().toLowerCase() ?? "";

const displayInning =
  (
    normalizedInningState.includes("end") ||
    normalizedInningState.includes("fin")
  ) &&
  typeof inning === "number"
    ? inning + 1
    : inning;
// En todas las ligas Middle/End son transiciones entre mitades,
// no turnos activos. Nunca reutilizar bases, conteo, outs ni jugadas
// de la mitad que terminó. LMP conserva su rótulo propio de inning.
const isInningTransition =
  normalizedInningState === "middle" ||
  normalizedInningState === "end";
const inningLabel = lmpMode
  ? getLmpInningLabel(inningState, inning)
  : `${formattedInningState} ${displayInning ?? ""}`.trim();
const shownFirst = isInningTransition ? 0 : first;
const shownSecond = isInningTransition ? 0 : second;
const shownThird = isInningTransition ? 0 : third;
const shownBalls = isInningTransition ? 0 : balls;
const shownStrikes = isInningTransition ? 0 : strikes;
const shownOuts = isInningTransition ? 0 : outs;
const shownPlays = isInningTransition ? [] : plays;
// Conservamos las etiquetas de historial de MLB/LMB.
const playHistoryLabel =
  normalizedInningState === "middle" && typeof inning === "number"
    ? `JUGADAS DE LA ALTA ${inning}`
    : normalizedInningState === "end" && typeof inning === "number"
      ? `JUGADAS DE LA BAJA ${inning}`
      : "JUGADAS DEL INNING";

const battingTeam =
  formattedInningState === "ALTA"
    ? away
    : formattedInningState === "BAJA"
      ? home
      : "";
  if (warmup) {
    return (
      <section className="liveGamePanel liveGameWarmupPanel" aria-label="Situación del juego: calentamiento">
        <div className="liveGamePanelHeader">
          <span className="eyebrow">SITUACIÓN DEL JUEGO</span>
          <span className="liveGameWarmupState">POR COMENZAR</span>
        </div>
        <div className="liveGameWarmupContent">
          <span className="liveGameWarmupDot" aria-hidden="true" />
          <strong>CALENTAMIENTO</strong>
          <p>{away} vs. {home}</p>
          <span>Los equipos se preparan para el primer lanzamiento.</span>
        </div>
      </section>
    );
  }
  return (
    <section className="liveGamePanel">
      <div className="liveGamePanelHeader" style={{ flexWrap: "wrap" }}>
        <span className="eyebrow">
          SITUACIÓN DEL JUEGO
        </span>

  {inning && (
  <div className="liveGameInningBlock">
    <strong className="liveGameInning">
      {inningLabel ?? "EN VIVO"}
    </strong>

    {!isInningTransition && battingTeam && (
      <span className="liveGameBattingTeam">
        BATEANDO · {battingTeam}
      </span>
    )}

    {!isInningTransition && batterName && (
      <span className="liveGameAtBat">
        AL BAT · {batterName}
      </span>
    )}

    {!isInningTransition && pitcherName && (
      <span className="liveGamePitching">
        LANZANDO · {pitcherName}
        {typeof pitchCount === "number"
          ? ` · ${pitchCount} P`
          : ""}
      </span>
    )}
  </div>
)}

</div>

      <div className="liveGamePanelBody">
        <div className="liveGameBases">
          <BaseDiamond
            first={shownFirst}
            second={shownSecond}
            third={shownThird}
          />
        </div>

        <div className="liveGameStats">
          <div>
            <small>BOLAS</small>
            <strong>{shownBalls}</strong>
          </div>

          <div>
            <small>STRIKES</small>
            <strong>{shownStrikes}</strong>
          </div>

          <div>
            <small>OUTS</small>
            <strong>{shownOuts}</strong>
          </div>
        </div>
      </div>

    {(lmpMode || plays.length > 0 || description) && (
      <div className="liveGamePlay">
        <small>
          {lmpMode
            ? "JUGADAS DEL INNING"
            : plays.length > 0
              ? playHistoryLabel
              : "ÚLTIMA JUGADA"}
        </small>

        {shownPlays.length > 0 ? (
          <div className="inningPlayList">
            {shownPlays.map((play, index) => (
              <div
                className="inningPlayItem"
                key={`${index}-${play}`}
              >
                <span>{index + 1}</span>
                <p>{play}</p>
              </div>
            ))}
          </div>
        ) : lmpMode ? (
          <p className="liveGameSourceWaiting">
            Esperando las primeras jugadas de este turno al bate.
          </p>
        ) : (
          <p>
            {description?.toLowerCase() === "al bat" && batterName
              ? `Al bat: ${batterName}`
              : description}
          </p>
        )}
      </div>
    )}
    </section>
  );
}
