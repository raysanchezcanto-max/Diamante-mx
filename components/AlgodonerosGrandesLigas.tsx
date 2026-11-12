import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import LmbRosterHeadshot from "@/components/LmbRosterHeadshot";
import {
  ALGODONEROS_MLB_PLAYERS as players,
  ALGODONEROS_MLB_PROSPECTS as prospects,
} from "@/lib/algodonerosMlbPaths";

export default function AlgodonerosGrandesLigas() {
  return (
    <section className="clubBigLeagues" aria-labelledby="clubBigLeaguesTitle">
      <header className="clubBigLeaguesHeader">
        <div>
          <span className="clubKicker">{COPY.mlb.kicker}</span>
          <h2 id="clubBigLeaguesTitle">{COPY.mlb.title("Algodoneros del Unión Laguna")}</h2>
          <p>{COPY.mlb.intro}</p>
        </div>
        <div className="clubBigLeaguesHeaderMark" aria-hidden="true"><span>UL</span><strong>→</strong><span>MLB</span></div>
      </header>

      <div className="clubBigLeaguesSummary" aria-label="Casos destacados documentados">
        <div><strong>01</strong><span>Debut en MLB tras pasar por Laguna</span></div>
        <div><strong>02</strong><span>Trayectorias de regreso a organizaciones MLB</span></div>
        <div><strong>04</strong><span>Firmas de prospectos de la academia</span></div>
      </div>

      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">TRAYECTORIAS DOCUMENTADAS</span>
        <h3>Del uniforme guinda al béisbol de Estados Unidos</h3>
      </div>

      <div className="clubBigLeaguesPlayers">
        {players.map((player, index) => (
          <article key={player.name} className={"clubBigLeaguesPlayer" + (index === 0 ? " clubBigLeaguesPlayerFeatured" : "")}>
            <div className="clubBigLeaguesPlayerTop">
              <span className="clubBigLeaguesPlayerPhoto">
                <LmbRosterHeadshot playerId={player.playerId} name={player.name} />
              </span>
              <div className="clubBigLeaguesPlayerIdentity">
                <span className={"clubBigLeaguesStatus clubBigLeaguesStatus-" + player.category}>{player.status}</span>
                <h4>{player.name}</h4>
                <span>{player.role} · {player.team}</span>
              </div>
              <span className="clubBigLeaguesYear">{player.year}</span>
            </div>
            <p>{player.description}</p>
            <ol className="clubBigLeaguesSteps">
              {player.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <a href={player.source} target="_blank" rel="noopener noreferrer">Consultar trayectoria oficial ↗</a>
          </article>
        ))}
      </div>

      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">{COPY.mlb.minorKicker}</span>
        <h3>{COPY.mlb.minorTitle}</h3>
      </div>
      <p className="clubBigLeaguesNote">
        Estas firmas representan oportunidades de desarrollo, no debuts confirmados
        en Grandes Ligas. Los nombres son una selección de operaciones publicadas,
        no el listado completo de prospectos del club.
      </p>
      <div className="clubBigLeaguesProspects">
        {prospects.map((player) => (
          <article key={player.name} className="clubBigLeaguesProspect">
            <div className="clubBigLeaguesProspectHeader">
              <span className="clubBigLeaguesInitials" aria-hidden="true">{player.initials}</span>
              <span className="clubBigLeaguesYear">{player.year}</span>
            </div>
            <h4>{player.name}</h4>
            <span className="clubBigLeaguesProspectOrganization">{player.organization} · {player.role}</span>
            <p>{player.detail}</p>
            <a href={player.source} target="_blank" rel="noopener noreferrer">Ver noticia de la firma ↗</a>
          </article>
        ))}
      </div>
      <footer className="clubBigLeaguesFooter">
        <strong>MLB ≠ Ligas Menores</strong>
        <p>
          El hecho de firmar con una organización de MLB no significa haber
          debutado en Grandes Ligas. La clasificación corresponde a hechos
          documentados hasta noviembre de 2026 y no indica el equipo o contrato
          actual de cada jugador.
        </p>
      </footer>
    </section>
  );
}
