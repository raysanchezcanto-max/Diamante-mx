import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";
import type { LmpClubDefinition } from "@/lib/lmpClubDirectory";
import { getTeamLogo } from "@/lib/teamLogos";

const clubHistory="https://editor.lmp.mx/el-club-aguilas-de-mexicali-celebra-su-75-aniversario/";
const historical="https://editor.lmp.mx/el-club-aguilas-de-mexicali-celebra-sus-74-anos-de-existencia/";
const guide="https://viewer.lmp.mx/files/lamp_guia_oficial_25_26.pdf";
const hallRoberto="https://editor.lmp.mx/el-club-aguilas-de-mexicali-felicita-a-roberto-chapo-vizcarra-por-su-entronizacion-al-salon-de-la-fama-del-beisbol-mexicano/";
const hallCananea="https://www.salondelafamadelbeisbolmexicano.com/inmortales-91-92";
const paquin="https://editor.lmp.mx/el-legado-que-deja-paquin-estrada-en-el-beisbol-invernal/";

const eras=[
 {year:"1976–77",title:"Primera temporada de Águilas en LMP",text:"El 12 de octubre de 1976 debutaron ante Naranjeros en Hermosillo; dos días después presentaron el equipo ante su afición en Mexicali.",url:historical},
 {year:"1985–86",title:"Primer campeonato y gloria caribeña",text:"Con Benjamín «Cananea» Reyes como mánager, Mexicali derrotó a Culiacán y posteriormente ganó la Serie del Caribe de 1986 en Maracaibo.",url:clubHistory},
 {year:"1988–89",title:"La segunda corona ante Mayos",text:"Con Dave Machemer al mando, Águilas venció a Mayos de Navojoa en siete partidos.",url:clubHistory},
 {year:"1998–99",title:"Tercera corona con Paquín Estrada",text:"Francisco «Paquín» Estrada dirigió al equipo que superó a Tomateros de Culiacán en la Serie Final.",url:clubHistory},
 {year:"2004",title:"El Toro llega a Mexicali",text:"Fernando Valenzuela defendió los colores del club, incorporándose a la larga lista de figuras de MLB que jugaron con los cachanillas.",url:clubHistory},
 {year:"2016–17",title:"La cuarta estrella de los emplumados",text:"El equipo dirigido por Roberto «Chapo» Vizcarra conquistó el cuarto título de LMP de su historia.",url:hallRoberto},
 {year:"2026–27",title:"Cincuenta temporadas desde su llegada a LMP",text:"Águilas compite en la campaña 2026–27, cincuenta años después de su primera temporada en el circuito moderno.",url:"https://editor.lmp.mx/chapo-vizcarra-es-ratificado-como-manager-de-aguilas-de-mexicali/"}
];
const personalities=[
 {name:"Benjamín «Cananea» Reyes",role:"Mánager campeón e inmortal",era:"1985–86",text:"Dirigió la primera corona LMP y el campeonato de Serie del Caribe de 1986.",url:clubHistory},
 {name:"Dave Machemer",role:"Mánager campeón",era:"1988–89",text:"Encabezó el plantel que consiguió la segunda corona cachanilla.",url:clubHistory},
 {name:"Francisco «Paquín» Estrada",role:"Mánager campeón e inmortal",era:"1998–99",text:"Ganó el título de 1998–99 en Mexicali; la LMP reconoce ampliamente su trayectoria como jugador y timonel.",url:paquin},
 {name:"Roberto «Chapo» Vizcarra",role:"Mánager campeón e inmortal",era:"2016–17",text:"Condujo la cuarta corona emplumada y fue elegido para el Salón de la Fama, clase 2023.",url:hallRoberto},
 {name:"John Kruk",role:"Bateador de la primera corona",era:"1985–86",text:"Formó parte del plantel que conquistó LMP y Serie del Caribe en 1986.",url:clubHistory},
 {name:"Fernando Valenzuela",role:"Lanzador con trayectoria MLB",era:"2004",text:"Se incorporó a Mexicali en una etapa posterior a su destacada carrera en Grandes Ligas.",url:clubHistory}
];
function initials(name:string){return name.replace(/[«»]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();}
export default function LmpAguilasEditorialHistory({club}:{club:LmpClubDefinition}){
 const logo=getTeamLogo("LMP",club.id,club.name);
 return <section className="clubHistory clubDirectoryHistory">
  <header className="clubHistoryHeading"><div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span><h2>{COPY.history.title(club.name)}</h2>
   <p>Los Caballeros Águilas se integraron a la LMP en 1976–77. Su historia reúne cuatro campeonatos de liga y una corona de Serie del Caribe, con etapas ganadoras dirigidas por grandes mánagers.</p>
  </div>{logo&&<img src={logo} alt="Escudo de Águilas de Mexicali" width={98} height={98}/>}</header>
  <ClubHistoryMetrics league="LMP" debutYear="1976" championships={4} seasonLabel="2025–26" stadiumName="El Nido de los Águilas" stadiumOpened="1976"/>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3></div><span className="clubHistoryNote">4 títulos LMP hasta 2025–26</span></div>
  <div className="clubHistoryChampions">{["1985–86","2016–17"].map((season,i)=><article className="clubHistoryChampionCard" key={season}>
   <span className="clubHistoryStar" aria-hidden="true">★</span>
   <span className="clubHistoryChampLabel">{i===0?COPY.history.firstCrown:COPY.history.recentCrown} · LMP</span>
   <strong>{season}</strong><h4>{i===0?COPY.history.firstGlory:COPY.history.mostRecentGlory}</h4>
   <p>{i===0?"Benjamín «Cananea» Reyes dirigió la primera estrella; ese plantel también conquistó la Serie del Caribe de 1986.":"Roberto «Chapo» Vizcarra condujo al equipo que logró su cuarta corona de LMP."}</p>
   <a href={guide} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
  </article>)}</div>
  <p className="clubSmallNote">Historial completo de campeonatos LMP: 1985–86 · 1988–89 · 1998–99 · 2016–17. La Serie del Caribe de 1986 se distingue de estos cuatro títulos de liga.</p>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
  <ol className="clubHistoryTimeline">{eras.map(event=><li key={event.year}><span className="clubHistoryYear">{event.year}</span><div className="clubHistoryTimelineBody"><h4>{event.title}</h4><p>{event.text}</p><a href={event.url} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a></div></li>)}</ol>
  <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
  <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
  <div className="clubHistoryLegends">{personalities.map(p=><article className="clubHistoryLegend" key={p.name}>
   <div className="clubHistoryLegendTop"><span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(p.name)}</span><span className="clubHistoryLegendEra">{p.era}</span></div>
   <h4>{p.name}</h4><span className="clubHistoryLegendRole">{p.role}</span><p>{p.text}</p><a href={p.url} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
  </article>)}</div>
  <section className="clubHistoryHall"><div className="clubHistoryHallHeader"><div>
   <span className="clubKicker">{COPY.history.hallKicker}</span><h3>{COPY.history.hallTitle}</h3><p>{COPY.history.hallNote}</p>
  </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
   <div className="clubHistoryHallGrid">
    {[
     {name:"Benjamín «Cananea» Reyes",role:"Mánager de Águilas campeón de 1985–86",year:"1991",link:hallCananea},
     {name:"Roberto «Chapo» Vizcarra",role:"Mánager de Águilas campeón de 2016–17",year:"2023",link:hallRoberto}
    ].map(person=><a className="clubHistoryHallMember" href={person.link} target="_blank" rel="noopener noreferrer" key={person.name}>
     <span className="clubHistoryHallMedal" aria-hidden="true">★</span><strong>{person.name}</strong><small>{person.role}</small><span>Entronizado {person.year} ↗</span>
    </a>)}
   </div>
  </section>
  <div className="clubHistoryOrigins"><div><span className="clubKicker">{COPY.history.stadiumKicker}</span><h3>El Nido de los Águilas</h3>
    <p>La Ciudad Deportiva de Mexicali recibió a Águilas en octubre de 1976. Su estadio es conocido como El Nido de los Águilas y es uno de los recintos tradicionales del béisbol de invierno.</p>
    <a href={historical} target="_blank" rel="noopener noreferrer">Consultar historia del club ↗</a></div>
    <ClubHistoryStadiumYear stadiumOpened="1976"/>
  </div>
  <footer className="clubHistorySources"><span className="clubKicker">{COPY.history.sourcesKicker}</span><p>El relato se fundamenta en el archivo del club difundido por LMP, su guía histórica y las referencias de entronización del Salón de la Fama. No pretende ser un listado exhaustivo de jugadores.</p><div>
   <a href={clubHistory} target="_blank" rel="noopener noreferrer">Historia y 75 aniversario ↗</a>
   <a href={guide} target="_blank" rel="noopener noreferrer">Guía oficial LMP ↗</a>
   <a href={hallRoberto} target="_blank" rel="noopener noreferrer">Vizcarra, clase 2023 ↗</a>
   <a href={hallCananea} target="_blank" rel="noopener noreferrer">Cananea Reyes, 1991 ↗</a>
  </div></footer>
 </section>;
}
