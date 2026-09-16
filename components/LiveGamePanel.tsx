import BaseDiamond from "./BaseDiamond";

type LiveGamePanelProps = {
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
    return "MITAD";
  }

  if (
    normalized === "end" ||
    normalized === "fin"
  ) {
    return "FIN";
  }

  return value?.toUpperCase() ?? "";
}

export default function LiveGamePanel({

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
plays = [],
}: LiveGamePanelProps) {
 const formattedInningState =
  formatInningState(inningState);

const battingTeam =
  formattedInningState === "ALTA"
    ? away
    : formattedInningState === "BAJA"
      ? home
      : ""; 
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
      {formattedInningState}{" "}
      {inning}
    </strong>

    {battingTeam && (
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
    {batterName && (
  <span
    style={{
      display: "block",
      fontSize: "11px",
      fontWeight: 600,
      color: "#ffffff",
      letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}
  >
   
   {pitcherName && (
  <span
    style={{
      display: "block",
      fontSize: "10px",
      fontWeight: 600,
      color: "#9fb1ab",
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

    {plays.length > 0 ? (
  <div className="liveGamePlay">
    <small>JUGADAS DEL INNING</small>

    <div className="inningPlayList">
      {plays.map((play, index) => (
        <div
          className="inningPlayItem"
          key={`${index}-${play}`}
        >
          <span>
            {index + 1}
          </span>

          <p>{play}</p>
        </div>
      ))}
    </div>
  </div>
) : description ? (
  <div className="liveGamePlay">
    <small>ÚLTIMA JUGADA</small>

    <p>
      {description.toLowerCase() === "al bat" &&
      batterName
        ? `Al bat: ${batterName}`
        : description}
    </p>
  </div>
) : null}
    </section>
  );
}
