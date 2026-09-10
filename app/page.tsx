import LeagueTabs from "@/components/LeagueTabs";
import Games from "@/components/Games";
import Standings from "@/components/Standings";
import Leaders from "@/components/Leaders";

import {
  getGames,
  getLeaders,
  getStandings,
} from "@/lib/mlb";

import {
  getLmpGames,
  getLmpLeaders,
  getLmpStandings,
} from "@/lib/lmp";

export const revalidate = 60;

type PageProps = {
  searchParams?: Promise<{
    league?: string;
  }>;
};

export default async function Home({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const selectedLeague =
    params?.league?.toLowerCase() === "lmp"
      ? "LMP"
      : "MLB";

  const [games, standings, leaders] =
    selectedLeague === "LMP"
      ? await Promise.all([
          getLmpGames(),
          getLmpStandings(),
          getLmpLeaders(),
        ])
      : await Promise.all([
          getGames(),
          getStandings(),
          getLeaders(),
        ]);
    const lmpSeasonStart = new Date(
    "2026-10-13T00:00:00-06:00"
  );

  const showLmpSeasonNotice =
    selectedLeague === "LMP" &&
    new Date() < lmpSeasonStart;

  const daysUntilLmp = Math.max(
    0,
    Math.ceil(
      (lmpSeasonStart.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );
  return (
    <main>
      <header className="topbar">
        <a
          className="brand"
          href="#top"
          aria-label="Diamante MX inicio"
        >
          <span className="diamond">◆</span>

          <span>
            <strong>DIAMANTE</strong>
            <em>MX</em>
          </span>
        </a>

        <nav>
          <a href="#juegos">Juegos</a>
          <a href="#posiciones">Posiciones</a>
          <a href="#lideres">Líderes</a>
        </nav>
      </header>

      <div id="top" className="hero">
        <div className="heroCopy">
          <span className="eyebrow">
            TODO EL BÉISBOL · UN SOLO DIAMANTE
          </span>

          <h1>
            El juego se vive
            <br />
            <span>dato a dato.</span>
          </h1>

          <p>
            Marcadores, posiciones y líderes de bateo
            en una experiencia pensada para aficionados
            del béisbol.
          </p>
        </div>

        <div className="heroMark" aria-hidden="true">
          ◆
        </div>
      </div>

      <LeagueTabs activeLeague={selectedLeague} />
            {showLmpSeasonNotice && (
        <div className="seasonNotice">
          <div>
            <span className="eyebrow">
              PRÓXIMA TEMPORADA · LMP 2026–2027
            </span>

            <h3>
              El béisbol del Pacífico regresa el 13 de octubre
            </h3>

            <p>
              La nueva temporada de la Liga Mexicana del
              Pacífico inicia el{" "}
              <strong>13 de octubre de 2026</strong>.
              Mientras tanto, puedes consultar las
              estadísticas de la temporada 2025–2026.
            </p>
          </div>

          <div className="seasonCountdown">
            <strong>{daysUntilLmp}</strong>
            <span>DÍAS PARA EL PLAYBALL</span>
          </div>
        </div>
      )}

      <div id="juegos">
  <Games
    games={games}
    league={selectedLeague}
  />
</div>

<div id="posiciones">
  <Standings
    standings={standings}
    league={selectedLeague}
  />
</div>

     <div id="lideres">
  <Leaders
    leaders={leaders}
    league={selectedLeague}
  />
</div>

      <footer>
        <div className="brand small">
          <span className="diamond">◆</span>

          <span>
            <strong>DIAMANTE</strong>
            <em>MX</em>
          </span>
        </div>

        <p>
          Proyecto independiente de estadísticas de
          béisbol.
        </p>
      </footer>
    </main>
  );
}
