import { getMlbChampion } from "@/lib/mlbChampion";
import { getLmbNextSeasonStart } from "@/lib/lmbLive";
import { getLmbChampion } from "@/lib/lmbChampion";
import AutoRefresh from "@/components/AutoRefresh";
import LeagueTabs from "@/components/LeagueTabs";
import Games from "@/components/Games";
import Standings from "@/components/Standings";
import Leaders from "@/components/Leaders";
import { getNextGames } from "@/lib/nextGames";
import RecentResults from "@/components/RecentResults";
import { getRecentGames } from "@/lib/recentGames";
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
import {
  getLmbGames,
  getLmbLeaders,
  getLmbStandings,
} from "@/lib/lmb";

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

  const leagueParam =
  params?.league?.toLowerCase();

const selectedLeague:
  "MLB" | "LMB" | "LMP" =
  leagueParam === "lmb"
    ? "LMB"
    : leagueParam === "lmp"
      ? "LMP"
      : "MLB";

  const [games, standings, leaders] =
  selectedLeague === "LMB"
    ? await Promise.all([
        getLmbGames(),
        getLmbStandings(),
        getLmbLeaders(),
      ])
    : selectedLeague === "LMP"
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

const nextGames =
  await getNextGames(selectedLeague);
    const lmpSeasonStart = new Date(
    "2026-10-13T00:00:00-06:00"
      );

     
 const recentGames =
  await getRecentGames(selectedLeague);

const lmbChampion =
  selectedLeague === "LMB"
    ? await getLmbChampion()
    : null;
  const mlbChampion =
  selectedLeague === "MLB"
    ? await getMlbChampion()
    : null;

const lmbNextSeasonYear =
  lmbChampion?.year
    ? lmbChampion.year + 1
    : new Date().getFullYear() + 1;

const lmbNextSeasonStart =
  selectedLeague === "LMB"
    ? await getLmbNextSeasonStart(
        lmbNextSeasonYear
      )
    : null;

const showLmbSeasonNotice =
  selectedLeague === "LMB" &&
  Boolean(lmbChampion) &&
  (
    !lmbNextSeasonStart ||
    Date.now() < lmbNextSeasonStart.getTime()
  );


const daysUntilLmb =
  lmbNextSeasonStart
    ? Math.max(
        0,
        Math.ceil(
          (
            lmbNextSeasonStart.getTime() -
            Date.now()
          ) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;


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
      <AutoRefresh
  enabled={games.some(
    (game) =>
      game.status === "Live" ||
      game.status === "Preview"
  )}
  intervalMs={30000}
/>
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
  nextGames={nextGames}
  recentGames={recentGames}
  lmbChampion={lmbChampion}
  league={selectedLeague}
/>
</div>
      {showLmbSeasonNotice && (
  <div className="seasonNotice">
    <div>
      <span className="eyebrow">
        PRÓXIMA TEMPORADA · LMB {lmbNextSeasonYear}
      </span>

     <h3>
  {lmbNextSeasonStart
    ? `El béisbol de verano regresa el ${new Intl.DateTimeFormat(
        "es-MX",
        {
          day: "numeric",
          month: "long",
          timeZone: "America/Mexico_City",
        }
      ).format(lmbNextSeasonStart)}`
    : `La temporada ${lmbNextSeasonYear} está por anunciarse`}
</h3>

      <p>
        {lmbNextSeasonStart ? (
          <>
            La temporada {lmbNextSeasonYear} de la Liga Mexicana de Beisbol
            inicia el{" "}
            <strong>
              {new Intl.DateTimeFormat(
                "es-MX",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "America/Mexico_City",
                }
              ).format(lmbNextSeasonStart)}
            </strong>
            .
          </>
        ) : (
          <>
            La LMB todavía no ha publicado la fecha oficial de inicio de la
            temporada {lmbNextSeasonYear}. En cuanto aparezca en el calendario
            oficial, Diamante MX la detectará automáticamente.
          </>
        )}
      </p>
    </div>

    <div className="seasonCountdown">
      {daysUntilLmb !== null ? (
        <>
          <strong>{daysUntilLmb}</strong>
          <span>DÍAS PARA EL PLAYBALL</span>
        </>
      ) : (
        <>
          <strong>—</strong>
          <span>CALENDARIO PENDIENTE</span>
        </>
      )}
    </div>
  </div>
)}
      <RecentResults
  games={recentGames}
  league={selectedLeague}
/>

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
