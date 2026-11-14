import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { MlbClub } from "@/lib/mlbClubDirectory";
import { mlbOfficialTeamUrl } from "@/lib/mlbClubDirectory";
import type { MlbClubOverview } from "@/lib/mlbClubContent";

export default function MlbClubEditorialHistory({
  club, overview, logo,
}: { club: MlbClub; overview: MlbClubOverview; logo: string | null }) {
  const official = mlbOfficialTeamUrl(club);
  const historyUrl = official + "/history";
  return <section className="clubHistory clubDirectoryHistory" aria-labelledby="mlbClubHistoryTitle">
    <header className="clubHistoryHeading">
      <div>
        <span className="clubKicker">HISTORIA · MAJOR LEAGUE BASEBALL</span>
        <h2 id="mlbClubHistoryTitle">{COPY.history.title(club.name)}</h2>
        <p>La historia de la franquicia, su trayectoria en Grandes Ligas, palmarés, protagonistas y estadio.
          Publicamos datos históricos por equipo únicamente cuando están respaldados por fuentes oficiales.</p>
      </div>
      {logo && <img src={logo} alt={"Escudo de " + club.name} width={98} height={98}/>}
    </header>
    <ClubHistoryMetrics league="MLB" debutYear={overview.firstYear} championships={null}
      seasonLabel={String(new Date().getUTCFullYear())} stadiumName={overview.stadium} stadiumOpened={null}/>

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.recordKicker}</span>
        <h3>{COPY.history.recordTitle("MLB")}</h3></div>
      <span className="clubHistoryNote">Coronas de Serie Mundial · revisión individual pendiente</span>
    </div>
    <div className="clubDirectoryNotice">
      <p>El historial de campeonatos de Serie Mundial de {club.name} está pendiente de cotejo
        franquicia por franquicia. No publicamos cifras ni años sin confirmar el palmarés.</p>
      <a href={historyUrl} target="_blank" rel="noopener noreferrer">Consultar historia oficial MLB ↗</a>
    </div>

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.timelineKicker}</span>
        <h3>{COPY.history.timelineTitle}</h3></div>
    </div>
    {overview.firstYear ? <ol className="clubHistoryTimeline">
      <li><span className="clubHistoryYear">{overview.firstYear}</span>
        <div className="clubHistoryTimelineBody">
          <h4>Primer año de la franquicia registrado por MLB</h4>
          <p>La ficha oficial de MLB indica {overview.firstYear} como primer año de juego de esta franquicia.
            La fecha puede preceder al nombre o ciudad actuales del equipo.</p>
          <a href={official} target="_blank" rel="noopener noreferrer">Ver fuente oficial ↗</a>
        </div>
      </li>
    </ol> : <div className="clubDirectoryNotice">
      <p>El primer año de esta franquicia no está disponible en la consulta oficial actual.</p>
    </div>}

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.figuresKicker}</span>
        <h3>{COPY.history.figuresTitle}</h3></div>
    </div>
    <div className="clubDirectoryNotice">
      <p>Las figuras históricas de {club.name} se incorporarán después de cotejar sus trayectorias
        y temporadas; evitamos atribuir jugadores de otra franquicia por error.</p>
      <a href={historyUrl} target="_blank" rel="noopener noreferrer">Archivo del club en MLB ↗</a>
    </div>

    <section className="clubHistoryHall" aria-labelledby="mlbClubHallTitle">
      <div className="clubHistoryHallHeader">
        <div><span className="clubKicker">{COPY.history.hallKicker}</span>
          <h3 id="mlbClubHallTitle">{COPY.history.hallTitle}</h3>
          <p>Vínculos específicos con esta franquicia y elecciones al Salón de la Fama de Cooperstown:
            revisión histórica pendiente. No se muestran nombres no documentados.</p></div>
        <a className="clubHistoryHallAll" href="https://baseballhall.org/hall-of-famers"
          target="_blank" rel="noopener noreferrer">Consultar Cooperstown ↗</a>
      </div>
    </section>

    <div className="clubHistoryOrigins">
      <div><span className="clubKicker">{COPY.history.stadiumKicker}</span>
        <h3>{overview.stadium ?? "Estadio por verificar"}</h3>
        <p>{overview.stadium
          ? "La ficha actual de MLB identifica este recinto como sede de " + club.name + "."
          : "No hay un estadio verificable en la respuesta actual de MLB."}
          {" "}La fecha original de inauguración se documentará con fuentes del estadio;
          no debe confundirse con el primer año de la franquicia.</p>
        <a href={official} target="_blank" rel="noopener noreferrer">Consultar ficha oficial ↗</a>
      </div>
      <ClubHistoryStadiumYear stadiumOpened={null}/>
    </div>

    <footer className="clubHistorySources">
      <span className="clubKicker">{COPY.history.sourcesKicker}</span>
      <p>Primer año, identidad y estadio proceden de la ficha de equipos de MLB StatsAPI.
        Campeonatos, personajes y año de apertura requieren verificación documental por club.</p>
      <div>
        <a href={official} target="_blank" rel="noopener noreferrer">Ficha oficial MLB ↗</a>
        <a href={historyUrl} target="_blank" rel="noopener noreferrer">Historia del club ↗</a>
        <a href="https://baseballhall.org/hall-of-famers" target="_blank"
          rel="noopener noreferrer">Salón de la Fama ↗</a>
      </div>
    </footer>
  </section>;
}
