import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { MlbClub } from "@/lib/mlbClubDirectory";
import { mlbOfficialTeamUrl } from "@/lib/mlbClubDirectory";
import type { MlbClubOverview } from "@/lib/mlbClubContent";
import { mlbEditorialHistory } from "@/lib/mlbHistoryEditorial";

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2)
  .map(part => part.charAt(0).toLocaleUpperCase("es")).join("");

export default function MlbClubEditorialHistory({
  club, overview, logo,
}: { club: MlbClub; overview: MlbClubOverview; logo: string | null }) {
  const official = mlbOfficialTeamUrl(club);
  const historyUrl = official + "/history";
  const editorial = mlbEditorialHistory(club.id);
  // StatsAPI firstYearOfPlay can precede the first MLB regular-season game.
  const documentedDebut = editorial?.debutYear ?? overview.firstYear;
  const documentedStadiumOpened = editorial?.stadiumOpened ?? null;
  const debutSourceUrl = editorial?.milestones[0]?.url ?? official;
  const timeline = editorial?.milestones ?? (overview.firstYear ? [{
    year: overview.firstYear,
    title: "Primer año registrado por MLB",
    description: "El registro inicial de esta franquicia puede preceder a su debut de temporada regular o al nombre actual.",
    url: official,
  }] : []);

  return <section className="clubHistory clubDirectoryHistory" aria-labelledby="mlbClubHistoryTitle">
    <header className="clubHistoryHeading">
      <div>
        <span className="clubKicker">HISTORIA · MAJOR LEAGUE BASEBALL</span>
        <h2 id="mlbClubHistoryTitle">{COPY.history.title(club.name)}</h2>
        <p>{editorial?.intro ??
          "La historia de la franquicia, su trayectoria en Grandes Ligas, palmarés, protagonistas y estadio. Publicamos datos históricos por equipo únicamente cuando están respaldados por fuentes oficiales."}</p>
      </div>
      {logo && <img src={logo} alt={"Escudo de " + club.name} width={98} height={98}/>}
    </header>

    <ClubHistoryMetrics league="MLB" debutYear={documentedDebut}
      championships={editorial?.worldSeriesTitles ?? null}
      seasonLabel={editorial?.titlesVerifiedThrough ?? String(new Date().getUTCFullYear())}
      stadiumName={overview.stadium} stadiumOpened={documentedStadiumOpened}/>

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.recordKicker}</span>
        <h3>{editorial?.worldSeriesTitles === 0
          ? "La búsqueda de la primera Serie Mundial"
          : COPY.history.recordTitle("MLB")}</h3></div>
      <span className="clubHistoryNote">{editorial
        ? "Palmarés verificado hasta " + editorial.titlesVerifiedThrough
        : "Coronas de Serie Mundial · revisión individual pendiente"}</span>
    </div>
    {editorial ? <>
      <div className="clubHistoryChampions">
        {[editorial.pennants[0], editorial.pennants[editorial.pennants.length - 1]]
          .filter((year, i, all) => year && all.indexOf(year) === i)
          .map((year, i) => <article className="clubHistoryChampionCard" key={year}>
            <span className="clubHistoryStar" aria-hidden="true">★</span>
            <span className="clubHistoryChampLabel">{i === 0
              ? "PRIMER BANDERÍN · LIGA AMERICANA"
              : "BANDERÍN MÁS RECIENTE · LIGA AMERICANA"}</span>
            <strong>{year}</strong>
            <h4>{i === 0 ? "Primera gran conquista" : "De regreso a la Serie Mundial"}</h4>
            <p>{club.name} ganó el título de la Liga Americana en {year} y avanzó a la Serie Mundial.</p>
            <a href="https://www.mlb.com/rays/history/postseason-results" target="_blank"
              rel="noopener noreferrer">Consultar palmarés ↗</a>
          </article>)}
      </div>
      <p className="clubSmallNote">Banderines de la Americana: {editorial.pennants.join(" · ")}.
        {" "}Títulos del Este de la Americana: {editorial.divisionTitles.join(" · ")}.</p>
      <div className="clubDirectoryNotice">
        <p>Hasta {editorial.titlesVerifiedThrough}, {club.name} no registra coronas de Serie Mundial.
          Los banderines de la Liga Americana son logros diferentes del campeonato de MLB.</p>
        <a href="https://www.mlb.com/rays/history/postseason-results" target="_blank"
          rel="noopener noreferrer">Historial oficial de postemporada ↗</a>
      </div>
    </> : <div className="clubDirectoryNotice">
      <p>El historial de campeonatos de Serie Mundial de {club.name} está pendiente de cotejo
        franquicia por franquicia. No publicamos cifras ni años sin confirmar el palmarés.</p>
      <a href={historyUrl} target="_blank" rel="noopener noreferrer">Consultar historia oficial MLB ↗</a>
    </div>}

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.timelineKicker}</span>
        <h3>{COPY.history.timelineTitle}</h3></div>
    </div>
    {timeline.length ? <ol className="clubHistoryTimeline">
      {timeline.map((item, index) => <li key={item.year + "-" + index}>
        <span className="clubHistoryYear">{item.year}</span>
        <div className="clubHistoryTimelineBody">
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">Ver fuente oficial ↗</a>
        </div>
      </li>)}
    </ol> : <div className="clubDirectoryNotice">
      <p>La cronología de esta franquicia todavía requiere revisión documental.</p>
    </div>}

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.figuresKicker}</span>
        <h3>{COPY.history.figuresTitle}</h3></div>
    </div>
    {editorial?.legends.length ? <>
      <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
      <div className="clubHistoryLegends">
        {editorial.legends.map(figure => <article className="clubHistoryLegend" key={figure.name}>
          <div className="clubHistoryLegendTop">
            <span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(figure.name)}</span>
            <span className="clubHistoryLegendEra">{figure.era}</span>
          </div>
          <h4>{figure.name}</h4>
          <span className="clubHistoryLegendRole">{figure.role}</span>
          <p>{figure.highlight}</p>
          <a href={figure.url} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
        </article>)}
      </div>
    </> : <div className="clubDirectoryNotice">
      <p>Las figuras históricas de {club.name} se incorporarán después de cotejar sus trayectorias
        y temporadas; evitamos atribuir jugadores de otra franquicia por error.</p>
      <a href={historyUrl} target="_blank" rel="noopener noreferrer">Archivo del club en MLB ↗</a>
    </div>}

    <section className="clubHistoryHall" aria-labelledby="mlbClubHallTitle">
      <div className="clubHistoryHallHeader">
        <div><span className="clubKicker">{COPY.history.hallKicker}</span>
          <h3 id="mlbClubHallTitle">{COPY.history.hallTitle}</h3>
          <p>{editorial?.immortals.length
            ? "Miembros del Salón de la Fama de Cooperstown que jugaron con esta franquicia. Se indican los años de entronización, no los de ingreso al club."
            : "Vínculos específicos con esta franquicia y elecciones al Salón de la Fama de Cooperstown: revisión histórica pendiente. No se muestran nombres no documentados."}</p>
        </div>
        <a className="clubHistoryHallAll" href="https://baseballhall.org/hall-of-famers"
          target="_blank" rel="noopener noreferrer">Consultar Cooperstown ↗</a>
      </div>
      {editorial?.immortals.length ? <div className="clubHistoryHallGrid">
        {editorial.immortals.map(person => <a className="clubHistoryHallMember"
          key={person.name} href={person.url} target="_blank" rel="noopener noreferrer">
          <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
          <strong>{person.name}</strong>
          <small>{person.role}</small>
          <span>Entronizado {person.year} ↗</span>
        </a>)}
      </div> : null}
    </section>

    <div className="clubHistoryOrigins">
      <div><span className="clubKicker">{COPY.history.stadiumKicker}</span>
        <h3>{overview.stadium ?? "Estadio por verificar"}</h3>
        <p>{editorial?.stadiumOpenedNote
          ?? (overview.stadium
            ? "La ficha actual de MLB identifica este recinto como sede de " + club.name + ". La fecha original de inauguración se documentará con fuentes del estadio."
            : "No hay un estadio verificable en la respuesta actual de MLB.")}</p>
        <a href={editorial?.stadiumSource ?? official} target="_blank" rel="noopener noreferrer">
          Conocer el estadio ↗</a>
      </div>
      <ClubHistoryStadiumYear stadiumOpened={documentedStadiumOpened}/>
    </div>

    <footer className="clubHistorySources">
      <span className="clubKicker">{COPY.history.sourcesKicker}</span>
      <p>{editorial
        ? "Fechas, títulos, personas y estadio de este perfil cuentan con referencias de MLB y Cooperstown. El palmarés se encuentra documentado hasta " + editorial.titlesVerifiedThrough + "."
        : "Identidad y estadio proceden de MLB StatsAPI. El primer año del registro puede anteceder al debut de temporada regular; campeonatos, figuras y fecha de apertura requieren revisión individual."}</p>
      <div>
        <a href={official} target="_blank" rel="noopener noreferrer">Ficha oficial MLB ↗</a>
        {(editorial?.sources ?? [{label: "Historia del club", url: historyUrl}])
          .map(source => <a href={source.url} key={source.url}
            target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}
        <a href="https://baseballhall.org/hall-of-famers" target="_blank"
          rel="noopener noreferrer">Salón de la Fama ↗</a>
      </div>
    </footer>
  </section>;
}
