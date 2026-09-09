import LeagueTabs from "@/components/LeagueTabs";
import Games from "@/components/Games";
import Standings from "@/components/Standings";
import Leaders from "@/components/Leaders";
import { getGames, getLeaders, getStandings } from "@/lib/mlb";

export const revalidate = 60;

export default async function Home() {
  const [games, standings, leaders] = await Promise.all([getGames(), getStandings(), getLeaders()]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Diamante MX inicio">
          <span className="diamond">◆</span>
          <span><strong>DIAMANTE</strong><em>MX</em></span>
        </a>
        <nav><a href="#juegos">Juegos</a><a href="#posiciones">Posiciones</a><a href="#lideres">Líderes</a></nav>
      </header>

      <div id="top" className="hero">
        <div className="heroCopy">
          <span className="eyebrow">TODO EL BÉISBOL · UN SOLO DIAMANTE</span>
          <h1>El juego se vive<br/><span>dato a dato.</span></h1>
          <p>Marcadores, posiciones y líderes de bateo en una experiencia pensada para aficionados del béisbol.</p>
        </div>
        <div className="heroMark" aria-hidden="true">◆</div>
      </div>

      <LeagueTabs />

      <div id="juegos"><Games games={games} /></div>
      <div id="posiciones"><Standings standings={standings} /></div>
      <div id="lideres"><Leaders leaders={leaders} /></div>

      <footer>
        <div className="brand small"><span className="diamond">◆</span><span><strong>DIAMANTE</strong><em>MX</em></span></div>
        <p>Proyecto independiente de estadísticas de béisbol. Datos MLB obtenidos desde MLB StatsAPI.</p>
      </footer>
    </main>
  );
}
