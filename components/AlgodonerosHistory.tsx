import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import {
  ALGODONEROS_HISTORY_LEGENDS as legends,
  ALGODONEROS_HISTORY_MILESTONES as milestones,
  ALGODONEROS_HISTORY_SOURCES as sources,
} from "@/lib/algodonerosHistory";

export default function AlgodonerosHistory({logo}: {logo:string}) {
  return (
    <section className="clubHistory" aria-labelledby="clubHistoryTitle">
      <div className="clubHistoryHeading">
        <div>
          <span className="clubKicker">HISTORIA · LIGA MEXICANA DE BEISBOL</span>
          <h2 id="clubHistoryTitle">{COPY.history.title("Algodoneros del Unión Laguna")}</h2>
          <p>
            Desde Torreón, los Algodoneros del Unión Laguna han escrito páginas
            memorables del beisbol mexicano. Conoce sus orígenes, las dos estrellas
            que adornan su historia y algunos de los peloteros que dejaron huella.
          </p>
        </div>
        <img src={logo} alt="Escudo de Algodoneros del Unión Laguna" width={98} height={98}/>
      </div>

      <div className="clubHistoryStats" aria-label="Datos históricos del club">
        <div><span>PRIMERA TEMPORADA LMB</span><strong>1940</strong><small>30 de marzo</small></div>
        <div><span>CAMPEONATOS LMB</span><strong>02</strong><small>1942 · 1950</small></div>
        <div><span>REGRESO DEL NOMBRE</span><strong>2018</strong><small>Algodoneros</small></div>
      </div>

      <div className="clubHistorySectionHead">
        <div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{COPY.history.recordTitle("Liga Mexicana")}</h3></div>
        <span className="clubHistoryNote">Títulos de LMB hasta 2026</span>
      </div>
      <div className="clubHistoryChampions">
        <article className="clubHistoryChampionCard">
          <span className="clubHistoryStar" aria-hidden="true">★</span>
          <span className="clubHistoryChampLabel">{COPY.history.firstCrown} · LMB</span>
          <strong>1942</strong>
          <h4>{COPY.history.firstGlory}</h4>
          <p>Con Martín Dihigo como jugador-mánager, Unión Laguna alcanzó la cima del circuito mexicano.</p>
          <a href={sources[0].url} target="_blank" rel="noopener noreferrer">Leer historia oficial ↗</a>
        </article>
        <article className="clubHistoryChampionCard">
          <span className="clubHistoryStar" aria-hidden="true">★</span>
          <span className="clubHistoryChampLabel">{COPY.history.recentCrown} · LMB</span>
          <strong>1950</strong>
          <h4>{COPY.history.mostRecentGlory}</h4>
          <p>El equipo dirigido por Guillermo «Memo» Garibay venció a Charros de Jalisco en seis partidos.</p>
          <a href={sources[2].url} target="_blank" rel="noopener noreferrer">Leer historia del campeonato ↗</a>
        </article>
      </div>

      <div className="clubHistorySectionHead">
        <div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div>
      </div>
      <ol className="clubHistoryTimeline">
        {milestones.map(item=>(
          <li key={item.year}>
            <span className="clubHistoryYear">{item.year}</span>
            <div className="clubHistoryTimelineBody">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
            </div>
          </li>
        ))}
      </ol>

      <div className="clubHistorySectionHead">
        <div>
          <span className="clubKicker">{COPY.history.figuresKicker}</span>
          <h3>{COPY.history.figuresTitle}</h3>
        </div>
      </div>
      <p className="clubHistoryIntro">
        Una selección histórica basada en temporadas destacadas y el archivo del
        club. No es un ranking absoluto de todos sus jugadores.
      </p>
      <div className="clubHistoryLegends">
        {legends.map(player=>(
          <article className="clubHistoryLegend" key={player.name}>
            <div className="clubHistoryLegendTop">
              <span className="clubHistoryLegendMonogram" aria-hidden="true">{player.initials}</span>
              <span className="clubHistoryLegendEra">{player.era}</span>
            </div>
            <h4>{player.name}</h4>
            <span className="clubHistoryLegendRole">{player.role}</span>
            <p>{player.summary}</p>
            <a href={player.source} target="_blank" rel="noopener noreferrer">Fuente histórica ↗</a>
          </article>
        ))}
      </div>

      <section className="clubHistoryHall" aria-labelledby="clubHistoryHallTitle">
        <div className="clubHistoryHallHeader">
          <div>
            <span className="clubKicker">{COPY.history.hallKicker}</span>
            <h3 id="clubHistoryHallTitle">{COPY.history.hallTitle}</h3>
            <p>
              Estas figuras tuvieron vínculo con Unión Laguna y están entronizadas
              en el Salón de la Fama del Beisbol Mexicano. Su año de ingreso
              está confirmado por el directorio oficial.
            </p>
          </div>
          <a className="clubHistoryHallAll" href="/salon-de-la-fama?club=algodoneros">
            Ver inmortales del club ↗
          </a>
        </div>
        <div className="clubHistoryHallGrid">
          {[
            {name:"Martín Dihigo",year:1964,role:"Jugador-mánager · campeón 1942"},
            {name:"Guillermo Garibay",year:1977,role:"Mánager · campeón 1950"},
            {name:"Jesús Díaz",year:1979,role:"Jardinero · Novato del Año 1942"},
            {name:"Antonio Pollorena",year:1991,role:"Lanzador · Unión Laguna"},
          ].map(item=>(
            <a className="clubHistoryHallMember" key={item.name}
              href={"/salon-de-la-fama?club=algodoneros&persona="+encodeURIComponent(item.name)}>
              <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
              <span>Entronizado {item.year} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="clubHistoryOrigins">
        <div>
          <span className="clubKicker">{COPY.history.stadiumKicker}</span>
          <h3>Estadio de la Revolución</h3>
          <p>
            La casa histórica de Unión Laguna está en Torreón, Coahuila. Su
            estadio acompañó al club desde su debut profesional de 1940 y fue
            escenario de sus dos campeonatos.
          </p>
          <a href={sources[0].url} target="_blank" rel="noopener noreferrer">Conocer la historia del estadio ↗</a>
        </div>
        <div className="clubHistoryStadiumMark" aria-hidden="true"><span>ESTADIO</span><strong>1940</strong><span>REVOLUCIÓN</span></div>
      </div>

      <footer className="clubHistorySources">
        <span className="clubKicker">{COPY.history.sourcesKicker}</span>
        <p>Información documentada por el club, la Liga Mexicana de Beisbol y MiLB. Los títulos y los hitos corresponden a la historia registrada hasta 2026.</p>
        <div>
          {sources.map(source=>(
            <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}>{source.label} ↗</a>
          ))}
        </div>
      </footer>
    </section>
  );
}
