import type { Standing } from "@/lib/mlb";

function teamLogo(teamId: number) {
  return `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${teamId}.svg`;
}

export default function Standings({
  standings,
}: {
  standings: Standing[];
}) {
  const divisions = Array.from(
    new Set(standings.map((s) => s.division))
  );

  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">TEMPORADA REGULAR</span>
          <h2>Tabla de posiciones</h2>
        </div>
      </div>

      {divisions.length === 0 ? (
        <div className="empty">
          Posiciones no disponibles.
        </div>
      ) : (
        <div className="standingsGrid">
          {divisions.map((division) => (
            <div className="tableCard" key={division}>
              <h3>{division}</h3>

              <div className="tableScroll">
                <table>
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>G</th>
                      <th>P</th>
                      <th>PCT</th>
                      <th>DIF</th>
                    </tr>
                  </thead>

                  <tbody>
                    {standings
                      .filter(
                        (s) => s.division === division
                      )
                      .map((row) => (
                        <tr key={row.team}>
                          <td>
                            <div className="standingsTeam">
                              <img
                                src={teamLogo(row.teamId)}
                                alt={`Logo de ${row.team}`}
                                width={26}
                                height={26}
                                loading="lazy"
                              />

                              <span>{row.team}</span>
                            </div>
                          </td>

                          <td>{row.wins}</td>
                          <td>{row.losses}</td>
                          <td>{row.pct}</td>
                          <td>{row.gamesBack}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
