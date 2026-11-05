import type { LmbClubRecord } from "@/lib/lmbClubs";
import { getLmbToMlbClub } from "@/lib/lmbToMlb";

type Props={club:LmbClubRecord;logo:string|null};

export default function LmbToMlbClubProfile({club,logo}:Props) {
  const record=getLmbToMlbClub(club.slug);
  const prospects=record?.prospects??[];
  const debuts=record?.debuts??[];
  const organizations=new Set(prospects.map(p=>p.organization)).size;
  const abbreviation=record?.abbreviation??"LMB";
  return (
    <section className="clubBigLeagues clubDirectoryMlb" aria-labelledby="clubToMlbTitle">
      <header className="clubBigLeaguesHeader">
        <div>
          <span className="clubKicker">DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL</span>
          <h2 id="clubToMlbTitle">De {club.name} a Grandes Ligas</h2>
          <p>
            El recorrido parte de {club.name} hacia organizaciones de MLB y sus
            Ligas Menores, nunca al revés. Distinguimos las firmas de prospectos
            de quienes efectivamente consiguieron debutar en Grandes Ligas.
          </p>
        </div>
        <div className="clubBigLeaguesHeaderMark" aria-hidden="true">
          {logo?<img className="clubToMlbHeroLogo" src={logo} alt="" width={65} height={65}/>:
            <span>{abbreviation}</span>}
          <strong>→</strong><span>MLB</span>
        </div>
      </header>

      {record ? (
        <>
          <div className="clubBigLeaguesSummary" aria-label="Trayectorias verificadas en fuentes del club">
            <div><strong>{String(prospects.length).padStart(2,"0")}</strong><span>Prospectos con firmas documentadas</span></div>
            <div><strong>{String(organizations).padStart(2,"0")}</strong><span>Organizaciones de Grandes Ligas</span></div>
            <div><strong>{debuts.length?String(debuts.length).padStart(2,"0"):"—"}</strong>
              <span>{debuts.length?"Debuts posteriores en MLB verificados":"Debut posterior en MLB sin verificar"}</span>
            </div>
          </div>

          {debuts.length>0&&(
            <>
              <div className="clubBigLeaguesSectionHead">
                <span className="clubKicker">LLEGARON A LA GRAN CARPA</span>
                <h3>Debutaron en MLB después de su paso por el club</h3>
              </div>
              <div className="clubBigLeaguesProspects">
                {debuts.map(player=>(
                  <article key={player.title} className="clubBigLeaguesProspect">
                    <span className="clubBigLeaguesStatus">DEBUT MLB CONFIRMADO</span>
                    <h4>{player.title}</h4>
                    <span className="clubBigLeaguesProspectOrganization">{player.mlbClub}</span>
                    <p>{player.description}</p>
                    <a href={player.source} target="_blank" rel="noopener noreferrer">Ver debut en fuente oficial ↗</a>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="clubBigLeaguesSectionHead">
            <span className="clubKicker">DEL SISTEMA DE DESARROLLO A ESTADOS UNIDOS</span>
            <h3>Prospectos firmados por organizaciones MLB</h3>
          </div>
          <p className="clubBigLeaguesNote">
            Estas firmas fueron reportadas por el propio club. No demuestran
            por sí mismas que los jugadores hayan disputado un encuentro de Grandes Ligas,
            ni confirman su contrato o equipo actual.
          </p>
          <div className="clubBigLeaguesProspects clubToMlbProspectGrid">
            {prospects.map(player=>(
              <article key={player.name} className="clubBigLeaguesProspect">
                <div className="clubBigLeaguesProspectHeader">
                  <span className="clubBigLeaguesInitials" aria-hidden="true">{player.initials}</span>
                  <span className="clubBigLeaguesYear">{player.seasonLabel}</span>
                </div>
                <span className="clubBigLeaguesStatus clubBigLeaguesStatus-minor">FIRMA CON ORGANIZACIÓN MLB</span>
                <h4>{player.name}</h4>
                <span className="clubBigLeaguesProspectOrganization">{player.role} · {player.organization}</span>
                <p>{player.note}</p>
                <a href={player.source} target="_blank" rel="noopener noreferrer">Leer comunicado del club ↗</a>
              </article>
            ))}
          </div>
          <div className="clubBigLeaguesFooter">
            <strong>Dirección del recorrido: {club.name} → MLB</strong>
            <p>
              La organización estadounidense puede contratar al prospecto para sus
              sucursales de desarrollo. La firma no implica debut en las Grandes Ligas.
              Este es un archivo histórico seleccionado y no un registro de afiliaciones
              vigentes ni de todos los prospectos del club.
            </p>
            <a className="clubDirectorySource" href={record.source} target="_blank" rel="noopener noreferrer">
              Fuente oficial del equipo ↗
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="clubDirectoryNotice">
            <span className="clubKicker">HISTORIAL DE TALENTO EXPORTADO</span>
            <h3>Trayectorias en proceso de documentación</h3>
            <p>
              Todavía no tenemos casos de salida hacia organizaciones de MLB
              individualmente verificados para {club.name}. Eso no significa
              que el club no haya desarrollado prospectos ni que no haya tenido
              jugadores en Grandes Ligas. Añadiremos únicamente firmas y debuts
              posteriores sustentados con fuentes identificables.
            </p>
            <a href={"https://lmb.com.mx/equipos/"+club.slug} target="_blank" rel="noopener noreferrer">
              Consultar perfil oficial del club ↗
            </a>
          </div>
          <div className="clubBigLeaguesFooter">
            <strong>Una trayectoria de ida no es lo mismo que una de regreso</strong>
            <p>
              Los peloteros que debutaron en MLB antes de llegar a la LMB son
              refuerzos con experiencia previa, no jugadores exportados por este
              equipo. Por eso no los mostramos como salidas a Grandes Ligas.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
