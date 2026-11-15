/**
 * Historia editorial de clubes MLB, incorporada franquicia por franquicia.
 * Cada fecha, premio y persona se publica solo con una fuente oficial revisada.
 * Este catálogo es distinto del registro firstYearOfPlay de StatsAPI:
 * ese campo puede anteceder al debut en Grandes Ligas.
 */
export type MlbHistoricalMilestone = {
  year: string;
  title: string;
  description: string;
  url: string;
};
export type MlbHistoricalFigure = {
  name: string;
  era: string;
  role: string;
  highlight: string;
  url: string;
};
export type MlbHallOfFamer = {
  name: string;
  year: string;
  role: string;
  url: string;
};
export type MlbHistoricalSource = { label: string; url: string };
export type MlbEditorialHistory = {
  intro: string;
  featuredStory: { title: string; excerpt: string; url: string; kicker: string };
  debutYear: string;
  worldSeriesTitles: number;
  worldSeriesWinningYears?: readonly string[];
  titlesVerifiedThrough: string;
  pennants: readonly string[];
  pennantLeagues?: Readonly<Record<string, string>>;
  postseasonSource?: string;
  divisionTitles: readonly string[];
  divisionTitlesLabel?: string;
  stadiumOpened: string;
  stadiumOpenedNote: string;
  stadiumSource: string;
  milestones: readonly MlbHistoricalMilestone[];
  legends: readonly MlbHistoricalFigure[];
  immortals: readonly MlbHallOfFamer[];
  sources: readonly MlbHistoricalSource[];
};

const RAYS_TIMELINE = "https://www.mlb.com/rays/history/timeline";
const RAYS_POSTSEASON = "https://www.mlb.com/rays/history/postseason-results";
const RAYS_RETIRED = "https://www.mlb.com/rays/history/retired-numbers";
const RAYS_STADIUM = "https://www.mlb.com/news/mlb-parks-from-oldest-to-newest";
const RAYS_2026_DIVISION = "https://www.mlb.com/rays/news/rays-clinch-2026-al-east-title";
const RAYS_HOF = "https://baseballhall.org/nine/tampa-bay-rays";

const histories: Readonly<Record<number, MlbEditorialHistory>> = {
  139: {
    intro: "Desde su debut en 1998, Tampa Bay pasó de sus años como Devil Rays a tres banderines de la Liga Americana. La franquicia ha disputado las Series Mundiales de 2008, 2020 y 2026, sin conquistar aún el título.",
    featuredStory: {
      kicker: "REPORTAJE · POSTEMPORADA MLB 2026",
      title: "LOS RAYS REGRESARON A LA SERIE MUNDIAL POR TERCERA VEZ",
      excerpt: "Tampa Bay conquistó la Liga Americana y disputó la Serie Mundial de 2026, en la que Milwaukee se impuso por cuatro juegos a uno.",
      url: "https://www.mlb.com/rays/news/rays-lose-2026-world-series-to-brewers",
    },
    debutYear: "1998",
    worldSeriesTitles: 0,
    titlesVerifiedThrough: "2026",
    pennants: ["2008", "2020", "2026"],
    divisionTitles: ["2008", "2010", "2020", "2021", "2026"],
    stadiumOpened: "1990",
    stadiumOpenedNote: "Tropicana Field abrió en 1990, ocho años antes del primer partido de temporada regular de la franquicia. El recinto se identificó originalmente como Florida Suncoast Dome.",
    stadiumSource: RAYS_STADIUM,
    milestones: [
      {
        year: "1995",
        title: "La franquicia llega a Tampa Bay",
        description: "MLB aprueba la expansión para los Devil Rays y los Diamondbacks; comienzan los preparativos del debut.",
        url: RAYS_TIMELINE,
      },
      {
        year: "1998",
        title: "Primer juego de temporada regular",
        description: "El 31 de marzo, Tampa Bay debuta ante Detroit en Tropicana Field, todavía como Devil Rays.",
        url: RAYS_TIMELINE,
      },
      {
        year: "2008",
        title: "De últimos a campeones de la Americana",
        description: "Con el nombre Rays, gana el Este de la Americana y su primer banderín; cae ante Philadelphia en la Serie Mundial.",
        url: RAYS_POSTSEASON,
      },
      {
        year: "2018",
        title: "El abridor relevista cambia la estrategia",
        description: "Tampa Bay populariza el uso del «opener» con Sergio Romo, una innovación que influye en el manejo del pitcheo.",
        url: RAYS_TIMELINE,
      },
      {
        year: "2020",
        title: "Segundo banderín de la Liga Americana",
        description: "En una temporada acortada, supera a Houston en la Serie de Campeonato y disputa la Serie Mundial ante los Dodgers.",
        url: RAYS_POSTSEASON,
      },
      {
        year: "2026",
        title: "Nueva corona divisional y tercera Serie Mundial",
        description: "Suma su quinto título del Este de la Americana y el tercer banderín de su historia. Milwaukee gana la Serie Mundial por 4-1.",
        url: RAYS_POSTSEASON,
      },
    ],
    legends: [
      {
        name: "Evan Longoria",
        era: "2008–2017",
        role: "Tercera base · Novato del Año 2008",
        highlight: "Figura emblemática de la franquicia y protagonista de su primera Serie Mundial. Los Rays retiraron su número 3 en 2026.",
        url: RAYS_RETIRED,
      },
      {
        name: "Carl Crawford",
        era: "Década de 2000",
        role: "Jardinero · velocidad",
        highlight: "Uno de los referentes más veloces del club; en 2009 robó seis bases en un juego, una marca histórica de la Liga Americana.",
        url: RAYS_HOF,
      },
      {
        name: "Blake Snell",
        era: "2018",
        role: "Lanzador · Cy Young de la Americana",
        highlight: "Ganó 21 partidos y registró efectividad de 1.89 en 2018, temporada que le dio el premio Cy Young.",
        url: RAYS_HOF,
      },
      {
        name: "Randy Arozarena",
        era: "2020",
        role: "Jardinero · postemporada",
        highlight: "Conectó diez cuadrangulares durante la postemporada de 2020, entonces récord de una misma edición.",
        url: RAYS_HOF,
      },
    ],
    immortals: [
      {
        name: "Wade Boggs",
        year: "2005",
        role: "Cooperstown · tercera base · Rays 1998–1999",
        url: "https://baseballhall.org/hall-of-famers/boggs-wade",
      },
      {
        name: "Fred McGriff",
        year: "2023",
        role: "Cooperstown · primera base · Rays 1998–2001 y 2004",
        url: "https://baseballhall.org/hall-of-famers/mcgriff-fred",
      },
    ],
    sources: [
      { label: "Cronología de la franquicia", url: RAYS_TIMELINE },
      { label: "Historial de postemporada", url: RAYS_POSTSEASON },
      { label: "Campeonato divisional 2026", url: RAYS_2026_DIVISION },
      { label: "Dorsales retirados", url: RAYS_RETIRED },
      { label: "Historia del estadio", url: RAYS_STADIUM },
      { label: "Archivo de Cooperstown", url: RAYS_HOF },
    ],
  },
  158: {
    intro: "La franquicia debutó en 1969 como Seattle Pilots y se mudó a Milwaukee en 1970. Tras su banderín de la Liga Americana en 1982, pasó a la Liga Nacional en 1998. En 2026 conquistó su primera Serie Mundial, al derrotar a Tampa Bay en cinco juegos.",
    featuredStory: {
      kicker: "REPORTAJE · CAMPEONES DE MLB 2026",
      title: "MILWAUKEE CONQUISTÓ SU PRIMERA SERIE MUNDIAL",
      excerpt: "Los Brewers vencieron 4-1 a los Rays y lograron el primer campeonato de Serie Mundial de su franquicia.",
      url: "https://www.mlb.com/brewers/news/brewers-beat-rays-game-5-win-2026-world-series",
    },
    debutYear: "1969",
    worldSeriesTitles: 1,
    worldSeriesWinningYears: ["2026"],
    titlesVerifiedThrough: "2026",
    pennants: ["1982", "2026"],
    pennantLeagues: { "1982": "Liga Americana", "2026": "Liga Nacional" },
    postseasonSource: "https://www.mlb.com/postseason/history/2026",
    divisionTitles: ["1981", "1982", "2011", "2018", "2021", "2023", "2024", "2025", "2026"],
    divisionTitlesLabel: "Títulos divisionales (1981: segunda mitad de temporada)",
    stadiumOpened: "2001",
    stadiumOpenedNote: "American Family Field abrió el 6 de abril de 2001 con el nombre Miller Park. Sustituyó al Milwaukee County Stadium; adoptó el nombre actual en 2021.",
    stadiumSource: "https://www.mlb.com/brewers/history/ballparks",
    milestones: [
      {
        year: "1969",
        title: "Debut como Seattle Pilots",
        description: "La franquicia juega su primera temporada de Grandes Ligas en Seattle, antes de trasladarse a Wisconsin.",
        url: "https://www.mlb.com/brewers/history/timeline-1960s",
      },
      {
        year: "1970",
        title: "Nacen los Milwaukee Brewers",
        description: "Bud Selig encabeza la compra de los Pilots y el club comienza a jugar en Milwaukee.",
        url: "https://www.mlb.com/brewers/history/timeline-1970s",
      },
      {
        year: "1982",
        title: "Primer banderín de liga",
        description: "Los llamados Harvey's Wallbangers ganan el título de la Americana y disputan la Serie Mundial contra San Luis.",
        url: "https://www.mlb.com/brewers/history/timeline-1980s",
      },
      {
        year: "1998",
        title: "Cambio a la Liga Nacional",
        description: "Milwaukee debuta como integrante de la Nacional y se incorpora a su División Central.",
        url: "https://www.mlb.com/brewers/history/timeline-1990s",
      },
      {
        year: "2001",
        title: "Estreno de su nueva casa",
        description: "El equipo inaugura Miller Park, hoy American Family Field, el 6 de abril frente a Cincinnati.",
        url: "https://www.mlb.com/news/remembering-miller-park-first-home-opener",
      },
      {
        year: "2026",
        title: "Primera Serie Mundial ganada",
        description: "Conquista la Nacional y vence 4-1 a Tampa Bay en la Serie Mundial para celebrar su primer campeonato.",
        url: "https://www.mlb.com/brewers/news/brewers-beat-rays-game-5-win-2026-world-series",
      },
    ],
    legends: [
      {
        name: "Robin Yount",
        era: "1974–1993",
        role: "Campocorto y jardinero · dos premios MVP",
        highlight: "Pasó sus veinte temporadas con Milwaukee y acumuló 3,142 imparables; ganó premios MVP en dos posiciones diferentes.",
        url: "https://baseballhall.org/hall-of-famers/yount-robin",
      },
      {
        name: "Paul Molitor",
        era: "1978–1992",
        role: "Bateador designado y jugador de cuadro",
        highlight: "Referente ofensivo de los Brewers de 1982; su trayectoria en Milwaukee lo llevó a ser uno de los grandes nombres de la franquicia.",
        url: "https://baseballhall.org/hall-of-famers/molitor-paul",
      },
      {
        name: "Rollie Fingers",
        era: "1981–1985",
        role: "Relevista · Cy Young y MVP 1981",
        highlight: "Con sus 28 salvamentos y efectividad de 1.04 en 1981, fue una pieza decisiva del pitcheo de Milwaukee.",
        url: "https://baseballhall.org/nine/milwaukee-brewers",
      },
      {
        name: "Christian Yelich",
        era: "2018–2026",
        role: "Jardinero · MVP de la Nacional 2018",
        highlight: "Fue uno de los líderes del club que consiguió el primer campeonato de Serie Mundial de los Brewers en 2026.",
        url: "https://www.mlb.com/brewers/news/brewers-beat-rays-game-5-win-2026-world-series",
      },
    ],
    immortals: [
      {
        name: "Robin Yount", year: "1999",
        role: "Cooperstown · 20 temporadas en Milwaukee",
        url: "https://baseballhall.org/hall-of-famers/yount-robin",
      },
      {
        name: "Rollie Fingers", year: "1992",
        role: "Cooperstown · relevista de los Brewers",
        url: "https://baseballhall.org/hall-of-famers/fingers-rollie",
      },
      {
        name: "Paul Molitor", year: "2004",
        role: "Cooperstown · jugador de cuadro de Milwaukee",
        url: "https://baseballhall.org/hall-of-famers/molitor-paul",
      },
    ],
    sources: [
      { label: "Cronología de la franquicia", url: "https://www.mlb.com/brewers/history" },
      { label: "Campeonato de 2026", url: "https://www.mlb.com/brewers/news/brewers-beat-rays-game-5-win-2026-world-series" },
      { label: "Postemporada 2026", url: "https://www.mlb.com/postseason/history/2026" },
      { label: "Títulos divisionales", url: "https://www.mlb.com/news/mlb-teams-with-most-division-titles" },
      { label: "Estadios del club", url: "https://www.mlb.com/brewers/history/ballparks" },
      { label: "Archivo de Cooperstown", url: "https://baseballhall.org/nine/milwaukee-brewers" },
    ],
  },
};

export function mlbEditorialHistory(teamId: number): MlbEditorialHistory | null {
  return histories[teamId] ?? null;
}
