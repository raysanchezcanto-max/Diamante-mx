import BaseDiamond from "./BaseDiamond";

type LiveGamePanelProps = {
  inning?: number;
  inningState?: string;

  first?: number;
  second?: number;
  third?: number;

  balls?: number;
  strikes?: number;
  outs?: number;

  description?: string;
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
  first = 0,
  second = 0,
  third = 0,
  balls = 0,
  strikes = 0,
  outs = 0,
  description,
}: LiveGamePanelProps) {
  return (
    <section className="liveGamePanel">
      <div className="liveGamePanelHeader">
        <span className="eyebrow">
          SITUACIÓN DEL JUEGO
        </span>

        {inning && (
          <strong className="liveGameInning">
            {formatInningState(
              inningState
            )}{" "}
            {inning}
          </strong>
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

      {description && (
        <div className="liveGamePlay">
          <small>ÚLTIMA JUGADA</small>
          <p>{description}</p>
        </div>
      )}
    </section>
  );
}
