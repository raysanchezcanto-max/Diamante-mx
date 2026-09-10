import type { Leader } from "@/lib/mlb";
import type { LeagueCode } from "@/lib/teamLogos";

function playerPhoto(
  league: LeagueCode,
  playerId: number
) {
  if (league === "LMP") {
    return `https://images.cloudgfx.com/player/mugshot/${playerId}?app=lamp&h=180&w=140`;
  }

  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_180,q_auto:best/v1/people/${playerId}/headshot/silo/current.png`;
}

function LeaderCard({
  title,
  unit,
  data,
  league,
}: {
  title: string;
  unit: string;
  data: Leader[];
  league: LeagueCode;
}) {
  return (
    <div className="leaderCard">
      <div className="leaderTitle">
        <h3>{title}</h3>
        <span>{unit}</span>
      </div>

      {data.length === 0 ? (
        <p className="muted">
          Sin datos disponibles.
        </p>
      ) : (
        data.slice(0, 8).map((p) => (
          <div
            className="leaderRow"
            key={`${title}-${p.rank}-${p.name}`}
          >
            <span className="rank">
              {p.rank}
            </span>

            <div className="playerWithPhoto">
              <img
                className="playerPhoto"
                src={playerPhoto(
                  league,
                  p.playerId
                )}
                alt={`Foto de ${p.name}`}
                width={44}
                height={44}
                loading="lazy"
              />

              <div className="player">
                <strong>{p.name}</strong>
                <small>{p.team}</small>
              </div>
            </div>

            <strong className="stat">
              {p.value}
            </strong>
          </div>
        ))
      )}
    </div>
  );
}

export default function Leaders({
  leaders,
  league = "MLB",
}: {
  leaders: {
    avg: Leader[];
    hr: Leader[];
    hits: Leader[];
  };
  league?: LeagueCode;
}) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">
            LÍDERES {league}
          </span>

          <h2>Líderes de bateo</h2>
        </div>
      </div>

      <div className="leadersGrid">
        <LeaderCard
          title="Promedio"
          unit="AVG"
          data={leaders.avg}
          league={league}
        />

        <LeaderCard
          title="Home Runs"
          unit="HR"
          data={leaders.hr}
          league={league}
        />

        <LeaderCard
          title="Hits"
          unit="H"
          data={leaders.hits}
          league={league}
        />
      </div>
    </section>
  );
}
