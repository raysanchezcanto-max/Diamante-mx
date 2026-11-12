import { ClubHistoryMetrics, ClubHistoryStadiumYear } from "@/components/ClubHistoryFacts";
import { CLUB_PROFILE_COPY as COPY } from "@/lib/clubProfileCopy";

type Props = { name: string; logo: string | null };
type Item = { year: string; title: string; description: string; url: string };
type Figure = { name: string; role: string; year: string; highlight: string; url: string };
const championship = "https://viewer.lmp.mx/files/lamp_guia_oficial_25_26.pdf";
const clubAnniversary = "https://losalgodoneros.com/algodoneros-celebra-55-anos-con-la-meta-intacta-de-ser-campeones/";
const comeback = "https://losalgodoneros.com/cronica-de-un-retorno-anunciado/";
const managers = "https://losalgodoneros.com/managers-que-dejado-huella-en-algodoneros/";
const final2023 = "https://losalgodoneros.com/14252-2/";
const noe = "https://losalgodoneros.com/un-algodonero-con-marca-de-salon-de-la-fama/";
const stadium = "https://www.kuroda.com/kuroda-park";
const history: readonly Item[] = [
  { year:"1970", title:"El nacimiento de Algodoneros", description:"Guasave comenzó su participación en la Liga Mexicana del Pacífico, estableciendo una identidad beisbolera que trascendería varias generaciones.", url:championship },
  { year:"1971–72", title:"Primera corona de la LMP", description:"En su segunda temporada, Guasave conquistó su campeonato de Liga Mexicana del Pacífico bajo la dirección de Vinicio García.", url:managers },
  { year:"1980–81", title:"La campaña dirigida por Tony Oliva", description:"Con Tony Oliva al mando, los Algodoneros encabezaron la primera vuelta y alcanzaron las semifinales de la liga.", url:managers },
  { year:"2014", title:"La despedida de la primera etapa", description:"La franquicia se trasladó a Jalisco tras la temporada 2013–14 y Guasave se quedó sin equipo de LMP por cinco años.", url:clubAnniversary },
  { year:"2019", title:"Regreso del béisbol profesional a Guasave", description:"El equipo regresó a LMP en la temporada 2019–20, acompañado por la remodelación de su estadio y el apoyo de la afición.", url:comeback },
  { year:"2022–23", title:"Otra Serie Final para los blanquiazules", description:"Algodoneros alcanzó la final frente a Cañeros de Los Mochis; terminó subcampeón en una serie de seis juegos.", url:final2023 },
  { year:"2023", title:"Noé Muñoz, inmortal del béisbol mexicano", description:"El receptor ligado a Guasave fue incluido entre los entronizados al Salón de la Fama del Beisbol Mexicano.", url:noe },
];
const legends:readonly Figure[] = [
  {name:"Vinicio García",role:"Mánager del campeonato",year:"1971–72",highlight:"Dirigió la primera y, hasta el palmarés consultado, única corona de LMP de Algodoneros.",url:managers},
  {name:"Tony Oliva",role:"Mánager y figura de MLB",year:"1980–81",highlight:"Condujo al equipo a semifinales; también es una figura histórica de los Minnesota Twins.",url:managers},
  {name:"Noé Muñoz",role:"Receptor histórico e inmortal",year:"Trayectoria histórica",highlight:"El club documenta su relación con Guasave y su entronización en el Salón de la Fama del Beisbol Mexicano en 2023.",url:noe},
  {name:"Édgar Leyva",role:"Lanzador histórico",year:"Primera etapa",highlight:"Pitcher sinaloense recordado por sus temporadas con los Algodoneros y su vínculo con la afición de Guasave.",url:"https://losalgodoneros.com/edgar-leyva-un-profeta-en-su-tierra/"},
  {name:"Óscar Robles",role:"Jugador y mánager",year:"2019–21",highlight:"Fue jugador del club y, tras el retorno de 2019, también dirigió a los Algodoneros.",url:"https://losalgodoneros.com/un-elemento-historico-para-algodoneros/"},
  {name:"Jesse Castillo",role:"Bateador de la final",year:"2023",highlight:"Conectó un jonrón importante durante la Serie Final de 2023 contra Cañeros de Los Mochis.",url:"https://losalgodoneros.com/solido-pitcheo-y-bateo-de-poder-llevan-a-algodoneros-a-la-victoria/"},
];
const initials=(name:string)=>name.split(/\s+/).slice(0,2).map(w=>w[0]?.toLocaleUpperCase("es")??"").join("");
export default function LmpAlgodonerosEditorialHistory({name,logo}:Props){
  return <section className="clubHistory clubDirectoryHistory" aria-labelledby="lmpGuasaveHistoryTitle">
    <header className="clubHistoryHeading">
      <div><span className="clubKicker">HISTORIA · LIGA MEXICANA DEL PACÍFICO</span>
        <h2 id="lmpGuasaveHistoryTitle">{COPY.history.title(name)}</h2>
        <p>Desde 1970, Guasave ha vivido el campeonato de 1971–72, temporadas memorables, una ausencia de cinco años y el regreso de su franquicia en 2019. Esta es una selección de su historia documentada.</p>
      </div>
      {logo&&<img src={logo} alt={"Escudo de "+name} width={98} height={98}/>}
    </header>

    <ClubHistoryMetrics league="LMP" debutYear="1970" championships={1} seasonLabel="2025–26" stadiumName="Kuroda Park" stadiumOpened="1970"/>

    <div className="clubHistorySectionHead">
      <div><span className="clubKicker">{COPY.history.recordKicker}</span><h3>{COPY.history.recordTitle("Liga Mexicana del Pacífico")}</h3></div>
      <span className="clubHistoryNote">Títulos LMP documentados</span>
    </div>
    <div className="clubHistoryChampions">
      <article className="clubHistoryChampionCard">
        <span className="clubHistoryStar" aria-hidden="true">★</span>
        <span className="clubHistoryChampLabel">{COPY.history.firstCrown} · LMP</span>
        <strong>1971–72</strong><h4>{COPY.history.firstGlory}</h4>
        <p>Algodoneros de Guasave forma parte del historial de campeones de la Liga Mexicana del Pacífico en 1971–72, con Vinicio García como mánager.</p>
        <a href={championship} target="_blank" rel="noopener noreferrer">Consultar palmarés ↗</a>
      </article>
    </div>
    <p className="clubSmallNote">Historial completo de títulos LMP confirmado hasta 2025–26: 1971–72.</p>

    <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.timelineKicker}</span><h3>{COPY.history.timelineTitle}</h3></div></div>
    <ol className="clubHistoryTimeline">
      {history.map((item,i)=><li key={item.year+"-"+i}>
        <span className="clubHistoryYear">{item.year}</span>
        <div className="clubHistoryTimelineBody"><h4>{item.title}</h4><p>{item.description}</p>
          <a href={item.url} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
        </div>
      </li>)}
    </ol>

    <div className="clubHistorySectionHead"><div><span className="clubKicker">{COPY.history.figuresKicker}</span><h3>{COPY.history.figuresTitle}</h3></div></div>
    <p className="clubHistoryIntro">{COPY.history.figuresNote}</p>
    <div className="clubHistoryLegends">
      {legends.map(legend=><article className="clubHistoryLegend" key={legend.name}>
        <div className="clubHistoryLegendTop">
          <span className="clubHistoryLegendMonogram" aria-hidden="true">{initials(legend.name)}</span>
          <span className="clubHistoryLegendEra">{legend.year}</span>
        </div>
        <h4>{legend.name}</h4><span className="clubHistoryLegendRole">{legend.role}</span>
        <p>{legend.highlight}</p>
        <a href={legend.url} target="_blank" rel="noopener noreferrer">Ver fuente histórica ↗</a>
      </article>)}
    </div>

    <section className="clubHistoryHall" aria-labelledby="lmpGuasaveHallTitle">
      <div className="clubHistoryHallHeader"><div>
        <span className="clubKicker">{COPY.history.hallKicker}</span>
        <h3 id="lmpGuasaveHallTitle">{COPY.history.hallTitle}</h3>
        <p>{COPY.history.hallNote}</p>
      </div><a className="clubHistoryHallAll" href="/salon-de-la-fama">Explorar Salón de la Fama ↗</a></div>
      <div className="clubHistoryHallGrid">
        <a className="clubHistoryHallMember" href={noe} target="_blank" rel="noopener noreferrer">
          <span className="clubHistoryHallMedal" aria-hidden="true">★</span>
          <strong>Noé Muñoz</strong>
          <small>Receptor histórico, vinculado a Algodoneros de Guasave</small>
          <span>Entronizado 2023 ↗</span>
        </a>
      </div>
    </section>

    <div className="clubHistoryOrigins">
      <div><span className="clubKicker">{COPY.history.stadiumKicker}</span>
        <h3>Kuroda Park</h3>
        <p>El estadio de Guasave fue renovado para el regreso del equipo en 2019. Su nombre comercial actual es Kuroda Park y cuenta con capacidad informada de 8,000 espectadores.</p>
        <a href={stadium} target="_blank" rel="noopener noreferrer">Conocer el estadio ↗</a>
      </div>
      <ClubHistoryStadiumYear stadiumOpened="1970"/>
    </div>

    <footer className="clubHistorySources">
      <span className="clubKicker">{COPY.history.sourcesKicker}</span>
      <p>Los hitos, personajes y títulos citados están documentados en el archivo del club y la guía oficial de LMP. Esta selección no es un censo histórico exhaustivo.</p>
      <div>
        <a href={championship} target="_blank" rel="noopener noreferrer">Guía oficial LMP ↗</a>
        <a href={clubAnniversary} target="_blank" rel="noopener noreferrer">55 años de Algodoneros ↗</a>
        <a href={managers} target="_blank" rel="noopener noreferrer">Mánagers históricos ↗</a>
        <a href={comeback} target="_blank" rel="noopener noreferrer">Regreso de 2019 ↗</a>
        <a href={noe} target="_blank" rel="noopener noreferrer">Noé Muñoz y Salón de la Fama ↗</a>
      </div>
    </footer>
  </section>;
}
