import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

/** Fuentes primarias del club y del Salón de la Fama del Beisbol Mexicano.
 * Se distinguen títulos LMP, Liga de la Costa y Series del Caribe.
 * La lista de inmortales es una selección documentada, no el censo completo.
 */
const club = "https://tomateros.com.mx/es";
const history = "https://web.tomateros.online/index.php/historia/";
const hall = "https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico";
const venue = "https://www.noroeste.com.mx/deportes/beisbol/ya-es-oficial-instalan-las-letras-del-estadio-juan-ley-fong-en-la-casa-de-los-tomateros-de-culiacan-NJ26499150";
const bicampeonato = "https://www.mlb.com/es/news/lmp-tomateros-se-proclaman-bicampeones";
const seasons = [
  "1966–67", "1969–70", "1977–78", "1982–83", "1984–85",
  "1995–96", "1996–97", "2001–02", "2003–04", "2014–15",
  "2017–18", "2019–20", "2020–21"
];
type Milestone = {year:string;title:string;text:string;source:string};
const timeline: readonly Milestone[] = [
  {year:"1945–56",title:"El antecedente: Tacuarineros de Culiacán",text:"La ciudad compitió en la antigua Liga de la Costa del Pacífico. Sus cuatro coronas pertenecen a ese circuito, no a la LMP moderna.",source:club},
  {year:"1965",title:"Nace la etapa de Tomateros",text:"El club inició su historia moderna en 1965, bajo el impulso de Juan Ley Fong.",source:history},
  {year:"1966–67",title:"Primera corona guinda",text:"Vinicio García dirigió a los Tomateros a su primer campeonato en la entonces Liga Invernal Sonora-Sinaloa.",source:history},
  {year:"1969–70",title:"Segundo campeonato con Vinicio García",text:"Tomateros conquistó su segunda corona de la mano del mismo mánager que ganó el primer título.",source:history},
  {year:"1977–78",title:"El jonrón decisivo de Jesús Sommers",text:"Jesús Sommers conectó un cuadrangular ante Cañeros de Los Mochis para asegurar la tercera corona de Culiacán.",source:history},
  {year:"1982–2004",title:"Las seis coronas de Paquín Estrada",text:"Francisco «Paquín» Estrada dirigió los campeonatos de 1982–83, 1984–85, 1995–96, 1996–97, 2001–02 y 2003–04.",source:history},
  {year:"1996",title:"Primera Serie del Caribe",text:"Tomateros se proclamó campeón del Caribe en Santo Domingo, con Paquín Estrada como mánager.",source:history},
  {year:"2002",title:"Segunda Serie del Caribe",text:"Culiacán ganó el campeonato de Caracas y se convirtió en el primer club mexicano que conquistaba dos Series del Caribe.",source:history},
  {year:"2014–15",title:"Décima corona y despedida del Ángel Flores",text:"Benjamín Gil dirigió al equipo campeón en su última campaña en el histórico Estadio General Ángel Flores.",source:history},
  {year:"2015",title:"Inauguración de una nueva casa",text:"El 9 de octubre de 2015 se inauguró el estadio moderno de Culiacán, originalmente denominado Estadio Tomateros.",source:venue},
  {year:"2020–21",title:"Bicampeonato y decimotercera corona",text:"Tomateros superó a Naranjeros en siete juegos; Jesse Castillo conectó dos jonrones en el decisivo.",source:bicampeonato},
  {year:"2026",title:"El estadio recibe el nombre Juan Ley Fong",text:"En octubre se oficializó el nuevo nombre del parque como homenaje al fundador de Tomateros. Cambió la denominación, no el año de inauguración.",source:venue}
];
type Legend = {name:string;era:string;role:string;description:string;source:string};
const legends: readonly Legend[] = [
 {name:"Vinicio García",era:"1966–70",role:"Mánager campeón e inmortal",description:"Condujo a Tomateros a sus primeras dos coronas; fue entronizado al Salón de la Fama del Beisbol Mexicano.",source:history},
 {name:"Francisco «Paquín» Estrada",era:"1982–2004",role:"Mánager de seis títulos LMP",description:"Dirigió seis campeonatos del circuito y las dos Series del Caribe del club.",source:history},
 {name:"Benjamín Gil",era:"2014–21",role:"Mánager de cuatro campeonatos",description:"Encabezó las coronas 2014–15, 2017–18, 2019–20 y 2020–21; también fue campeón como pelotero.",source:history},
 {name:"Jesús Sommers",era:"1977–78",role:"Bateador del campeonato",description:"Conectó el jonrón que definió la tercera corona frente a Los Mochis.",source:history},
 {name:"Rodrigo López",era:"2002",role:"Lanzador de Serie del Caribe",description:"Lanzó juego completo y blanqueada en el encuentro decisivo del campeonato caribeño de Caracas.",source:history},
 {name:"Héctor Espino",era:"Legado histórico",role:"Primera base y dorsal retirado",description:"Figura legendaria del beisbol invernal mexicano reconocida entre los números retirados de Tomateros.",source:club},
 {name:"Vicente Romo",era:"Legado histórico",role:"Lanzador y dorsal retirado",description:"Integrante de la galería de números retirados de la franquicia y del Salón de la Fama mexicano.",source:club},
 {name:"Nelson Barrera",era:"Legado histórico",role:"Bateador y dorsal retirado",description:"Reconocido por Tomateros con su número retirado y entronizado al Salón de la Fama mexicano.",source:club}
];
const inductees = [
 {name:"Vinicio García",year:"1981",relation:"Mánager de las primeras dos coronas de Tomateros"},
 {name:"Héctor Espino",year:"1988",relation:"Primera base; número 21 retirado por el club"},
 {name:"Vicente Romo",year:"1992",relation:"Lanzador; número 27 retirado por Tomateros"},
 {name:"Francisco «Paquín» Estrada",year:"2000",relation:"Mánager de seis coronas LMP y dos del Caribe"},
 {name:"Jesús Sommers",year:"2002",relation:"Jugador del equipo campeón de 1977–78"},
 {name:"Nelson Barrera",year:"2003",relation:"Bateador histórico; número 16 retirado por el club"}
] as const;
function initials(name:string){return name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0]).join("").toLocaleUpperCase("es");}

export default function LmpTomaterosEditorialHistory({club:team}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",team.id,team.name);
 return <section className="clubHistory clubDirectoryHistory" aria-labelledby="lmpTomaterosHistory">
  <header className="clubHistoryHeading">
   <div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
    <h2 id="lmpTomaterosHistory">{COPY.history.title(team.name)}</h2>
    <p>Desde 1965, Tomateros ha conquistado 13 títulos de la LMP y dos Series del Caribe. La tradición guinda también conserva un legado anterior como Tacuarineros, que se documenta por separado.</p></div>
   {logo&&<img src={logo} alt={"Escudo de "+team.name} width={98} height={98}/>}
  </header>
  <ClubHistoryMetrics league="LMP" debutYear="1965" championships={seasons.length} seasonLabel="2025–26" stadiumName="Estadio Juan Ley Fong" stadiumOpened="2015"/>
  <div className="clubHistorySectionHead">
   <div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3></div>
   <span className="clubHistoryNote">13 campeonatos LMP · 2 Series del Caribe</span>
  </div>
  <div className="clubHistoryChampions">
   {[seasons[0],seasons[seasons.length-1]].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
    <span className="clubHistoryStar" aria-hidden="true">★</span>
    <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
    <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
    <p>{i===0?"Vinicio García dirigió la primera corona guinda.":"Benjamín Gil condujo la decimotercera corona de LMP, con victoria en el séptimo juego frente a Naranjeros."}</p>
    <a href={i===0?history:bicampeonato} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
   </article>)}
  </div>
  <p className="clubSmallNote">Los 13 títulos de LMP: {seasons.join(" · ")}. Separados: 4 títulos de Tacuarineros en la antigua Liga de la Costa (1948–49, 1949–50, 1951–52, 1955–56) y 2 Series del Caribe (1996 y 2002).</p>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">
   {timeline.map(event=><li key={event.year}>
    <span className="clubHistoryYear">{event.year}</span>
    <div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.text}</p>
     <a href={event.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div>
   </li>)}
  </ol>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">
   {legends.map(person=><article className="clubHistoryLegend" key={person.name}>
    <div className="clubHistoryLegendTop">
     <span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(person.name)}</span>
     <span className="clubHistoryLegendEra">{person.era}</span>
    </div>
    <h4>{person.name}</h4><span className="clubHistoryLegendRole">{person.role}</span>
    <p>{person.description}</p><a href={person.source} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
   </article>)}
  </div>
  <section className="clubHistoryHall">
   <div className="clubHistoryHallHeader"><div><span className="clubKicker">{COPY.history.hallKicker}</span>
    <h3>{COPY.history.hallTitle}</h3><p>{COPY.history.hallNote}</p></div>
    <a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a>
   </div>
   <div className="clubHistoryHallGrid">
    {inductees.map(person=><a className="clubHistoryHallMember" href={hall} key={person.name} target="_blank" rel="noopener noreferrer">
     <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
     <strong>{person.name}</strong><small>{person.relation}</small><span>Entronizado {person.year} ↗</span>
    </a>)}
   </div>
  </section>
  <div className="clubHistoryOrigins"><div>
   <span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>Estadio Juan Ley Fong</h3>
   <p>Inaugurado el 9 de octubre de 2015 como Estadio Tomateros, el parque actual recibió oficialmente el nombre de Estadio Juan Ley Fong en octubre de 2026, en honor al fundador del club. El antiguo General Ángel Flores fue la casa de generaciones anteriores.</p>
   <a href={venue} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
   </div><ClubHistoryStadiumYear stadiumOpened="2015"/></div>
  <footer className="clubHistorySources">
   <span className="clubKicker">{COPY.history.sourcesKicker}</span>
   <p>Los hitos, títulos, figuras y entronizaciones están sustentados en el club, el Salón de la Fama del Beisbol Mexicano y publicaciones verificadas. La selección no es una biografía exhaustiva de cada jugador.</p>
   <div><a href={club} target="_blank" rel="noopener noreferrer">Palmarés oficial de Tomateros ↗</a>
    <a href={history} target="_blank" rel="noopener noreferrer">Historia del club ↗</a>
    <a href={hall} target="_blank" rel="noopener noreferrer">Inmortales por orden alfabético ↗</a>
    <a href={venue} target="_blank" rel="noopener noreferrer">Nombre actual del estadio ↗</a>
   </div>
  </footer>
 </section>;
}
