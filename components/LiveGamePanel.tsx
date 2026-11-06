import BaseDiamond from "./BaseDiamond";

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
// En LMP, Middle/End indican una transición, no un turno activo.
const isInningTransition =
  lmpMode &&
  (normalizedInningState === "middle" ||
    normalizedInningState === "end");
// Conservar la rotulación anterior de MLB/LMB; en LMP el título será genérico.
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
      <div className="liveGamePanelHeader">
        <span className="eyebrow">
          SITUACIÓN DEL JUEGO
        </span>

  {inning && (
  <div
    className="liveGameInningBlock"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "4px",
    }}
  >
    <strong className="liveGameInning">
      {isInningTransition ? "CAMBIO DE ENTRADA" :
        `${formattedInningState} ${displayInning ?? ""}`}
    </strong>

    {!isInningTransition && battingTeam && (
      <span
        className="liveGameBattingTeam"
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 600,
          color: "#8fa9a0",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        BATEANDO · {battingTeam}
      </span>
    )}

    {!isInningTransition && batterName && (
      <span
        style={{
          display: "block",
          marginTop: "2px",
          fontSize: "11px",
          fontWeight: 700,
          color: "#e6efec",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        AL BAT · {batterName}
      </span>
    )}

    {!isInningTransition && pitcherName && (
      <span
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 600,
          color: "#c7d3cf",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        LANZANDO · {pitcherName}
        {typeof pitchCount === "number"
          ? ` · ${pitchCount} P`
          : ""}
      </span>
    )}
  </div>
)}

</div>

      {isInningTransition ? (
        <div className="liveGamePanelBody">
          <p className="liveGameSourceWaiting">
            Esperando el inicio del turno al bate.
          </p>
        </div>
      ) : (
      <div className="liveGamePanelBody">
        <div className="liveGameBases">
          <BaseDiamond
            first={first}
            second={second}
            third={third}
          />
        </div>

        <div className="liveGameStats">
          <div>
            <small>BOLAS</small>
            <strong>{balls}</strong>
          </div>

          <div>
            <small>STRIKES</small>
            <strong>{strikes}</strong>
          </div>

          <div>
            <small>OUTS</small>
            <strong>{outs}</strong>
          </div>
        </div>
      </div>
      )}

    {(!isInningTransition && (lmpMode || plays.length > 0 || description)) && (
      <div className="liveGamePlay">
        <small>
          {lmpMode
            ? "JUGADAS DEL INNING"
            : plays.length > 0
              ? playHistoryLabel
              : "ÚLTIMA JUGADA"}
        </small>

        {plays.length > 0 ? (
          <div className="inningPlayList">
            {plays.map((play, index) => (
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
