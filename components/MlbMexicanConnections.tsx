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
  const { debuts, previousExperience, prospects, toMexico } = getMlbMexicanConnections(club);
  const groups: Group[] = [
    { id: "debut", kicker: "DEBUT POSTERIOR EN GRANDES LIGAS",
      title: "Debutaron en MLB después de su paso por México",
      status: "DEBUT MLB CONFIRMADO", people: debuts },
    { id: "mexico", kicker: "DE GRANDES LIGAS AL BÉISBOL MEXICANO",
      title: "De esta franquicia MLB a equipos de LMB y LMP",
      status: "JUGÓ EN MÉXICO TRAS SU ETAPA EN MLB", people: toMexico },
    { id: "experiencia", kicker: "TRAYECTORIA PREVIA",
      title: "Experiencia MLB anterior a una nueva firma",
      status: "EXPERIENCIA MLB PREVIA", people: previousExperience },
    { id: "sucursales", kicker: COPY.mlb.minorKicker,
      title: "Prospectos y contratos de Ligas Menores",
      status: "ORGANIZACIÓN MLB · NO IMPLICA DEBUT", people: prospects },
  ];
  const total = debuts.length + toMexico.length + previousExperience.length + prospects.length;

  return <section className="clubBigLeagues clubDirectoryMlb clubDirectoryMlb--franchise"
    aria-labelledby="mlbMexicanConnectionsTitle">
    <header className="clubBigLeaguesHeader">
      <div>
        <span className="clubKicker">{COPY.mlb.kicker}</span>
        <h2 id="mlbMexicanConnectionsTitle">{club.name} y el béisbol mexicano</h2>
        <p>Conexiones históricas verificadas con clubes de la Liga Mexicana de Beisbol
          (LMB) y de la Liga Mexicana del Pacífico (LMP), en ambos sentidos.
          Distinguimos participaciones, debuts en MLB y contratos de sucursales;
          no representan la plantilla actual ni un censo completo de jugadores.</p>
      </div>
      <div className="clubBigLeaguesHeaderMark" aria-hidden="true">
        <span className="clubMexicanLeaguesMark">LMB + LMP</span><strong>↔</strong>
        {logo ? <img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>
          : <span>MLB</span>}
      </div>
    </header>

    <div className="clubBigLeaguesSummary" aria-label="Trayectorias documentadas en esta ficha">
      <div><strong>{String(debuts.length).padStart(2, "0")}</strong>
        <span>Debuts en MLB después de LMB o LMP</span></div>
      <div><strong>{String(toMexico.length).padStart(2, "0")}</strong>
        <span>Trayectorias de MLB a clubes mexicanos</span></div>
      <div><strong>{String(previousExperience.length).padStart(2, "0")}</strong>
        <span>Experiencia MLB previa a otra firma</span></div>
      <div><strong>{String(prospects.length).padStart(2, "0")}</strong>
        <span>Firmas o contratos para sucursales</span></div>
    </div>

    <p className="clubBigLeaguesNote">Las cifras cuentan vínculos documentados por club y liga,
      no jugadores únicos ni el total histórico. Un mismo pelotero puede aparecer
      por LMB y por LMP cuando existen pruebas de ambas etapas.</p>

    {total ? groups.filter(group => group.people.length).map(group => <div key={group.id}>
      <div className="clubBigLeaguesSectionHead">
        <span className="clubKicker">{group.kicker}</span>
        <h3>{group.title}</h3>
      </div>
      <div className="clubBigLeaguesProspects clubToMlbProspectGrid">
        {group.people.map(person => <article className="clubBigLeaguesProspect"
          key={`${person.league}-${person.mexicanSlug}-${person.name}-${group.id}`}>
          <div className="clubBigLeaguesProspectHeader">
            <span className="clubBigLeaguesInitials" aria-hidden="true">
              {person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("")}
            </span>
            <span className="clubBigLeaguesYear">{person.year}</span>
          </div>
          <span className="clubBigLeaguesStatus">{person.league} · {group.status}</span>
          <h4>{person.name}</h4>
          <span className="clubBigLeaguesProspectOrganization">
            {person.role} · {person.league} · {person.mexicanClub}
          </span>
          <p>{person.description}</p>
          <a href={person.source} target="_blank" rel="noopener noreferrer">
            Consultar fuente documentada ↗</a>
          {person.verificationSource && <a href={person.verificationSource}
            target="_blank" rel="noopener noreferrer">Ver segunda fuente ↗</a>}
          <a href={`/equipos/${person.league.toLowerCase()}/${person.mexicanSlug}?vista=grandes-ligas`}>
            Ver trayectoria en {person.mexicanClub} ↗</a>
        </article>)}
      </div>
    </div>) : <div className="clubDirectoryNotice">
      <h3>Archivo de conexiones en investigación</h3>
      <p>Aún no hemos incorporado expedientes documentados entre {club.name}
        y equipos de LMB o LMP. No significa que la franquicia no tenga
        conexiones con México: la revisión individual sigue pendiente.</p>
    </div>}

    <footer className="clubBigLeaguesFooter">
      <strong>Una firma de sucursales no significa haber debutado en MLB</strong>
      <p>Estos registros históricos no acreditan contratos vigentes ni traspasos
        directos entre clubes. Cada vínculo lleva fuentes de consulta y conserva
        la categoría que permiten verificar. Las estadísticas de temporada se
        consultan en Estadísticas y los hitos del club en Historia.</p>
    </footer>
  </section>;
}
