import type { MlbClub } from "@/lib/mlbClubDirectory";
import { getMlbMexicanConnections, type MexicanConnection } from "@/lib/mlbMexicanConnections";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";

type Group = {
  id: string;
  kicker: string;
  title: string;
  status: string;
  people: MexicanConnection[];
};

export default function MlbMexicanConnections({ club, logo }: {
  club: MlbClub;
  logo: string | null;
}) {
  const { debuts, previousExperience, prospects } = getMlbMexicanConnections(club);
  const groups: Group[] = [
    { id: "debut", kicker: "DEBUT POSTERIOR EN GRANDES LIGAS",
      title: "Debutaron en MLB después de su paso por México",
      status: "DEBUT MLB CONFIRMADO", people: debuts },
    { id: "experiencia", kicker: "TRAYECTORIA PREVIA",
      title: "Experiencia MLB anterior a su regreso a una organización",
      status: "EXPERIENCIA MLB PREVIA", people: previousExperience },
    { id: "sucursales", kicker: COPY.mlb.minorKicker,
      title: "Prospectos y contratos de Ligas Menores",
      status: "ORGANIZACIÓN MLB · NO IMPLICA DEBUT", people: prospects },
  ];
  const total = debuts.length + previousExperience.length + prospects.length;

  return <section className="clubBigLeagues clubDirectoryMlb clubDirectoryMlb--franchise"
    aria-labelledby="mlbMexicanConnectionsTitle">
    <header className="clubBigLeaguesHeader">
      <div>
        <span className="clubKicker">{COPY.mlb.kicker}</span>
        <h2 id="mlbMexicanConnectionsTitle">Del béisbol mexicano a {club.name}</h2>
        <p>Trayectorias documentadas entre clubes de la Liga Mexicana de Beisbol
          y la organización de {club.name}. Diferenciamos debuts oficiales,
          experiencia anterior y contratos para sucursales; no son estadísticas
          de temporada ni la plantilla actual de la franquicia.</p>
      </div>
      <div className="clubBigLeaguesHeaderMark" aria-hidden="true">
        <span>LMB</span><strong>→</strong>
        {logo ? <img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>
          : <span>MLB</span>}
      </div>
    </header>

    <div className="clubBigLeaguesSummary" aria-label="Trayectorias documentadas en esta ficha">
      <div><strong>{String(debuts.length).padStart(2, "0")}</strong>
        <span>Debuts en MLB posteriores al paso por México</span></div>
      <div><strong>{String(previousExperience.length).padStart(2, "0")}</strong>
        <span>Casos con experiencia previa en MLB</span></div>
      <div><strong>{String(prospects.length).padStart(2, "0")}</strong>
        <span>Firmas y contratos para desarrollo</span></div>
    </div>

    {total ? groups.filter(group => group.people.length).map(group => <div key={group.id}>
      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">{group.kicker}</span>
        <h3>{group.title}</h3>
      </div>
      <div className="clubBigLeaguesProspects clubToMlbProspectGrid">
        {group.people.map(person => <article className="clubBigLeaguesProspect"
          key={`${person.mexicanSlug}-${person.name}-${group.id}`}>
          <div className="clubBigLeaguesProspectHeader">
            <span className="clubBigLeaguesInitials" aria-hidden="true">
              {person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("")}
            </span>
            <span className="clubBigLeaguesYear">{person.year}</span>
          </div>
          <span className="clubBigLeaguesStatus">{group.status}</span>
          <h4>{person.name}</h4>
          <span className="clubBigLeaguesProspectOrganization">
            {person.role} · {person.mexicanClub}
          </span>
          <p>{person.description}</p>
          <a href={person.source} target="_blank" rel="noopener noreferrer">
            Consultar fuente documentada ↗</a>
          {person.verificationSource && <a href={person.verificationSource}
            target="_blank" rel="noopener noreferrer">Ver segunda fuente ↗</a>}
          <a href={`/equipos/lmb/${person.mexicanSlug}?vista=grandes-ligas`}>
            Ver trayectoria en {person.mexicanClub} ↗</a>
        </article>)}
      </div>
    </div>) : <div className="clubDirectoryNotice">
      <h3>Sin trayectorias verificadas en nuestro archivo actual</h3>
      <p>Todavía no contamos con casos suficientemente documentados para vincular
        a {club.name} con un club mexicano en esta categoría. Esto no significa
        que no existan; la investigación editorial continúa.</p>
    </div>}

    <footer className="clubBigLeaguesFooter">
      <strong>Las firmas de Ligas Menores no son debuts en MLB</strong>
      <p>Estos registros históricos no acreditan contratos vigentes ni traspasos
        directos entre clubes. Cada vínculo tiene su propia fuente y conserva
        la categoría que la documentación permite verificar. La información
        de temporadas, posiciones y figuras históricas corresponde a Resumen
        e Historia.</p>
    </footer>
  </section>;
}
