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
  // MLB StatsAPI can report organizational years before the first MLB season.
  // The Rays played their first MLB regular-season game on March 31, 1998.
  const isRays = club.id === 139;
  const documentedDebut = isRays ? "1998" : overview.firstYear;
  const documentedStadiumOpened = isRays ? "1990" : null;
  const debutSourceUrl = isRays ? historyUrl + "/timeline" : official;
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
    <ClubHistoryMetrics league="MLB" debutYear={documentedDebut} championships={null}
      seasonLabel={String(new Date().getUTCFullYear())} stadiumName={overview.stadium}
      stadiumOpened={documentedStadiumOpened}/>

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
    {documentedDebut ? <ol className="clubHistoryTimeline">
      <li><span className="clubHistoryYear">{documentedDebut}</span>
        <div className="clubHistoryTimelineBody">
          <h4>{isRays ? "Primer partido de temporada regular en MLB" : "Primer año registrado por MLB"}</h4>
          <p>{isRays
            ? "Tampa Bay disputó su primer partido de temporada regular el 31 de marzo de 1998. La organización ya existía durante sus preparativos previos al debut."
            : "La ficha de MLB identifica " + documentedDebut + " como año inicial del registro de la franquicia; puede preceder al debut de temporada regular o al nombre actual."}</p>
          <a href={debutSourceUrl} target="_blank" rel="noopener noreferrer">Ver fuente oficial ↗</a>
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
          {" "}{isRays
            ? "Tropicana Field abrió en 1990, antes del debut de los Rays en 1998, según el archivo oficial de MLB."
            : "La fecha original de inauguración se documentará con fuentes del estadio; no debe confundirse con el primer año de la franquicia."}</p>
        <a href={official} target="_blank" rel="noopener noreferrer">Consultar ficha oficial ↗</a>
      </div>
      <ClubHistoryStadiumYear stadiumOpened={documentedStadiumOpened}/>
    </div>

    <footer className="clubHistorySources">
      <span className="clubKicker">{COPY.history.sourcesKicker}</span>
      <p>Identidad y estadio se consultan en MLB StatsAPI. {isRays
        ? "Para Tampa Bay, el debut de 1998 y la apertura de Tropicana Field en 1990 están contrastados con la cronología y el archivo de estadios de MLB."
        : "El año inicial es el del registro de StatsAPI y no necesariamente el debut en MLB; la inauguración del recinto sigue por verificar."}
        Campeonatos y figuras históricas requieren verificación documental por club.</p>
      <div>
        <a href={official} target="_blank" rel="noopener noreferrer">Ficha oficial MLB ↗</a>
        <a href={historyUrl} target="_blank" rel="noopener noreferrer">Historia del club ↗</a>
        {isRays && <a href="https://www.mlb.com/news/mlb-parks-from-oldest-to-newest" target="_blank" rel="noopener noreferrer">Historia del estadio ↗</a>}
        <a href="https://baseballhall.org/hall-of-famers" target="_blank"
          rel="noopener noreferrer">Salón de la Fama ↗</a>
      </div>
    </footer>
  </section>;
}
