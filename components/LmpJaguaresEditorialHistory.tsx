import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Jaguares debutó en 2025–26; su liderato de temporada regular no es campeonato LMP. */
const league="https://editor.lmp.mx/jaguares-de-nayarit-llega-a-la-lamp-mayos-jugara-en-tucson/";
const stadium="https://www.gob.mx/conade/prensa/conade-presente-en-la-inauguracion-del-coloso-del-pacifico-nuevo-estadio-de-beisbol-en-tepic";
const training="https://www.lmp.mx/noticias/los-jaguares-invaden-el-coloso-del-pacifico";
const ceremonial="https://editor.lmp.mx/jaguares-de-nayarit-confirma-a-mariano-rivera-para-lanzar-la-primera-bola-en-la-inauguracion-el-15-de-octubre/";
const sweep="https://editor.lmp.mx/jaguares-completa-barrida-historica-ante-yaquis/";
const playoffs="https://editor.lmp.mx/asi-se-jugaran-los-playoff-de-la-temporada-2025-2026/";
const manager="https://editor.lmp.mx/luis-carlos-rivera-gana-el-trofeo-benjamin-cananea-reyes-a-manager-del-ano/";
const farewell="https://editor.lmp.mx/blanqueada-de-algodoneros-y-estan-en-semifinales/";
const firstWin="https://www.lmp.mx/noticias/jaguares-se-lleva-trepidante-duelo-ante-tomateros";
const seasonTwo="https://editor.lmp.mx/jaguares-abre-pretemporada-con-la-mira-puesta-en-la-cima/";
const sepulveda="https://editor.lmp.mx/llego-carlos-sepulveda-a-los-jaguares-de-nayarit/amp/";
const rookie="https://www.lmp.mx/noticias/angel-ramirez-es-el-novato-del-ano-de-la-temporada-2025-2026";
type Milestone={year:string;title:string;description:string;source:string};
const timeline:readonly Milestone[]=[
 {year:"Nov 2024",title:"Abre el Coloso del Pacífico",description:"El estadio de Tepic se inauguró con un juego de exhibición México–Cuba, antes de que existiera Jaguares como equipo LMP.",source:stadium},
 {year:"20 may 2025",title:"La liga aprueba a Jaguares",description:"La asamblea de presidentes oficializó la nueva franquicia con sede en Tepic y a Carlos Peralta al frente del proyecto.",source:league},
 {year:"1 sep 2025",title:"Primer entrenamiento oficial",description:"Luis Carlos Rivera encabezó los trabajos en el Coloso del Pacífico con el cuerpo técnico y 22 peloteros.",source:training},
 {year:"15 oct 2025",title:"Primer juego en LMP",description:"Jaguares inauguró su historia competitiva ante Venados de Mazatlán en Tepic. Mariano Rivera fue invitado a lanzar la primera bola.",source:ceremonial},
 {year:"Oct 2025",title:"Primera victoria en casa",description:"La novena nayarita obtuvo ante Tomateros de Culiacán su primera victoria de temporada en el Coloso del Pacífico.",source:firstWin},
 {year:"Nov 2025",title:"Primera barrida de la franquicia",description:"Jaguares completó tres victorias consecutivas ante Yaquis de Ciudad Obregón.",source:sweep},
 {year:"Dic 2025",title:"Líder general en el año de estreno",description:"Con marca de 40–28, Jaguares cerró primero en el standing general y en la clasificación de puntos de 2025–26.",source:playoffs},
 {year:"Ene 2026",title:"El debut en playoffs",description:"El club disputó su primera postemporada contra Algodoneros de Guasave y quedó eliminado en la primera ronda.",source:farewell},
 {year:"2025–26",title:"Primer premio de Mánager del Año",description:"Luis Carlos Rivera recibió el trofeo Benjamín «Cananea» Reyes por la extraordinaria campaña inaugural.",source:manager},
 {year:"2026–27",title:"Comienza una nueva etapa",description:"La franquicia preparó su segunda temporada con el objetivo de superar lo conseguido en el debut.",source:seasonTwo}
];
type Figure={name:string;era:string;role:string;description:string;source:string};
const figures:readonly Figure[]=[
 {name:"Carlos Peralta Quintero",era:"Desde 2025",role:"Impulsor y directivo fundador",description:"Encabezó el proyecto aprobado por la liga para llevar una franquicia invernal a Tepic.",source:league},
 {name:"Luis Carlos Rivera",era:"2025–26",role:"Primer mánager y Mánager del Año",description:"Condujo el primer equipo de Jaguares a marca de 40–28 y recibió el premio de dirigente de la temporada.",source:manager},
 {name:"Carlos Sepúlveda",era:"Desde 2025",role:"Jugador del cuadro",description:"Integrante destacado del primer plantel; su llegada se anunció antes del debut del club.",source:sepulveda},
 {name:"Carlos Medina",era:"2025–26",role:"Joven revelación",description:"Finalista al premio Novato del Año de LMP, terminó segundo en la votación con 28 por ciento.",source:rookie},
 {name:"Mariano Rivera",era:"15 oct 2025",role:"Invitado de honor en el estreno",description:"El inmortal de Cooperstown fue anunciado para efectuar el lanzamiento ceremonial de la primera bola; no fue jugador de Jaguares.",source:ceremonial}
];
const initials=(name:string)=>name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toLocaleUpperCase("es");

export default function LmpJaguaresEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="jaguaresHistoryTitle">
  <header className="clubHistoryHeading"><div>
   <span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
   <h2 id="jaguaresHistoryTitle">{COPY.history.title(club.name)}</h2>
   <p>Una franquicia joven que comenzó a rugir en Tepic en 2025: en su primera campaña lideró la temporada regular de LMP y estrenó su historia de postemporada. La primera corona todavía está por conquistarse.</p>
  </div>{logo&&<img src={logo} alt={"Escudo de "+club.name} width={98} height={98}/>}</header>

  <ClubHistoryMetrics league="LMP" debutYear="2025" championships={0} seasonLabel="2025–26" stadiumName="Coloso del Pacífico" stadiumOpened="2024"/>

  <div className="clubHistorySectionHead"><div>
   <span className="clubKicker">{COPY.history.recordKicker}</span>
   <h3>Una historia que empieza a escribirse</h3>
  </div><span className="clubHistoryNote">0 títulos LMP · debut 2025–26</span></div>
  <div className="clubHistoryChampions">
   <article className="clubHistoryChampionCard">
    <span className="clubHistoryStar" aria-hidden="true">◆</span>
    <span className="clubHistoryChampLabel">PRIMER GRAN LOGRO · TEMPORADA REGULAR</span>
    <strong>40–28</strong><h4>Líder general de LMP en su debut</h4>
    <p>Jaguares cerró 2025–26 en el primer lugar del standing general, pero este liderato no representa un campeonato de liga.</p>
    <a href={playoffs} target="_blank" rel="noopener noreferrer">Consultar clasificación oficial ↗</a>
   </article>
   <article className="clubHistoryChampionCard">
    <span className="clubHistoryStar" aria-hidden="true">◆</span>
    <span className="clubHistoryChampLabel">RECONOCIMIENTO · TEMPORADA 2025–26</span>
    <strong>2026</strong><h4>Primer premio de Mánager del Año</h4>
    <p>Luis Carlos Rivera obtuvo el trofeo Benjamín «Cananea» Reyes tras dirigir al club en su estreno.</p>
    <a href={manager} target="_blank" rel="noopener noreferrer">Ver premio oficial ↗</a>
   </article>
  </div>
  <p className="clubSmallNote">Hasta el cierre de la campaña 2025–26: ningún campeonato LMP ni Serie del Caribe. El liderato de fase regular y los reconocimientos individuales se muestran por separado.</p>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span>
   <h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{timeline.map(event=><li key={event.year+"-"+event.title}>
   <span className="clubHistoryYear">{event.year}</span>
   <div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.description}</p>
    <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div>
  </li>)}</ol>

  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span>
   <h3>Protagonistas de los primeros años</h3></div></div>
  <p className="clubHistoryIntro">La franquicia aún no tiene décadas de leyendas propias. Estas son personas documentadas que participaron en sus inicios o en la ceremonia inaugural.</p>
  <div className="clubHistoryLegends">{figures.map(person=><article className="clubHistoryLegend" key={person.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span><span className="clubHistoryLegendEra">{person.era}</span></div>
   <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
   <p>{person.description}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>

  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div>
   <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3>
   <p>El club nació en 2025. Aún no contamos con jugadores entronizados documentados por una trayectoria con Jaguares. Mariano Rivera, miembro del Salón de la Fama de Cooperstown, participó como invitado ceremonial: no se le atribuye una trayectoria deportiva con el equipo.</p>
  </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubDirectoryNotice"><p>Sin miembros vinculados a una trayectoria histórica de Jaguares verificados por ahora. Esta sección crecerá conforme se documente la historia de la franquicia.</p></div>
  </section>

  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Coloso del Pacífico · Don Alejo Peralta</h3>
   <p>Su casa en Tepic abrió el 6 de noviembre de 2024 con un encuentro de exhibición de México frente a Cuba, como preparación del Premier12. En octubre de 2025 recibió el primer partido LMP de Jaguares. La apertura del estadio y el debut del club son acontecimientos distintos.</p>
   <a href={stadium} target="_blank" rel="noopener noreferrer">Consultar inauguración oficial ↗</a>
  </div><ClubHistoryStadiumYear stadiumOpened="2024"/></div>

  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Datos tomados de comunicados oficiales de LMP, prensa del equipo publicada por la liga y CONADE. Es una selección de hitos iniciales, no una relación exhaustiva de jugadores o de resultados.</p>
   <div><a href={league} target="_blank" rel="noopener noreferrer">Fundación de la franquicia ↗</a>
    <a href={stadium} target="_blank" rel="noopener noreferrer">Inauguración del estadio ↗</a>
    <a href={playoffs} target="_blank" rel="noopener noreferrer">Clasificación 2025–26 ↗</a>
    <a href={manager} target="_blank" rel="noopener noreferrer">Mánager del Año ↗</a>
   </div>
  </footer>
 </section>;
}
