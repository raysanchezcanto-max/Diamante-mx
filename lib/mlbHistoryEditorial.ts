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
  pennantSources?: Readonly<Record<string, string>>;
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
const DBACKS_TIMELINE = "https://www.mlb.com/dbacks/history/timeline";
const DBACKS_POSTSEASON = "https://www.mlb.com/dbacks/history/postseason-results";
const DBACKS_AWARDS = "https://www.mlb.com/dbacks/history/awards";
const DBACKS_RETIRED = "https://www.mlb.com/dbacks/history/retired-numbers";
const DBACKS_STADIUM = "https://www.mlb.com/dbacks/ballpark";
const BRAVES_TIMELINE = "https://www.mlb.com/braves/history/timeline";
const BRAVES_STORY = "https://www.mlb.com/braves/history/story-of-the-braves";
const BRAVES_POSTSEASON = "https://www.mlb.com/braves/history/postseason-results";
const BRAVES_RETIRED = "https://www.mlb.com/braves/history/retired-numbers";
const BRAVES_HOF = "https://www.mlb.com/braves/history/hall-of-famers";
const BRAVES_BALLPARKS = "https://www.mlb.com/braves/history/ballpark";

const histories: Readonly<Record<number, MlbEditorialHistory>> = {
  109: {
    intro: "Arizona debutó en Grandes Ligas en 1998 como franquicia de expansión. Ganó la División Oeste de la Liga Nacional en su segunda temporada y conquistó la Serie Mundial de 2001 ante los Yankees. En 2023 volvió al Clásico de Otoño, esta vez como subcampeón ante Texas.",
    featuredStory: {
      kicker: "HISTORIA · SERIE MUNDIAL 2001",
      title: "EL IMPARABLE DE LUIS GONZÁLEZ QUE CORONÓ A ARIZONA",
      excerpt: "En el séptimo juego de 2001, un sencillo de Luis González frente a Mariano Rivera permitió que Jay Bell anotara la carrera del primer campeonato de los Diamondbacks.",
      url: "https://www.mlb.com/dbacks/news/top-moments-in-diamondbacks-history",
    },
    debutYear: "1998",
    worldSeriesTitles: 1,
    worldSeriesWinningYears: ["2001"],
    titlesVerifiedThrough: "2026",
    pennants: ["2001", "2023"],
    postseasonSource: DBACKS_POSTSEASON,
    divisionTitles: ["1999", "2001", "2002", "2007", "2011"],
    stadiumOpened: "1998",
    stadiumOpenedNote: "Chase Field abrió el 31 de marzo de 1998 como Bank One Ballpark, para el primer partido de temporada regular de Arizona frente a Colorado. Su techo retráctil ayuda a proteger del calor de Phoenix.",
    stadiumSource: DBACKS_STADIUM,
    milestones: [
      {
        year: "1995",
        title: "MLB concede una franquicia a Arizona",
        description: "La expansión de Grandes Ligas abre paso a un nuevo equipo en Phoenix, que comenzará a competir en 1998.",
        url: DBACKS_TIMELINE,
      },
      {
        year: "1998",
        title: "Debut frente a Colorado",
        description: "El 31 de marzo juega su primer encuentro de temporada regular en el recién inaugurado Bank One Ballpark.",
        url: "https://www.mlb.com/dbacks/history/club-firsts",
      },
      {
        year: "1999",
        title: "Primer campeonato divisional",
        description: "En apenas su segunda campaña, Arizona gana el Oeste de la Liga Nacional y consigue su primera clasificación a los playoffs.",
        url: DBACKS_TIMELINE,
      },
      {
        year: "2001",
        title: "Una Serie Mundial para la historia",
        description: "Supera 4-3 a los Yankees: Luis González impulsa la carrera decisiva en la novena entrada del séptimo juego.",
        url: DBACKS_POSTSEASON,
      },
      {
        year: "2004",
        title: "Juego perfecto de Randy Johnson",
        description: "El 18 de mayo, el zurdo retira a los 27 bateadores de Atlanta y registra el primer juego perfecto de la franquicia.",
        url: "https://www.mlb.com/dbacks/history/no-hitters",
      },
      {
        year: "2023",
        title: "Segundo banderín de la Nacional",
        description: "Remonta la Serie de Campeonato contra Philadelphia y regresa a la Serie Mundial, en la que cae ante Texas por 4-1.",
        url: "https://www.mlb.com/dbacks/news/d-backs-win-nlcs-2023",
      },
    ],
    legends: [
      {
        name: "Randy Johnson",
        era: "1999–2004 y 2007–2008",
        role: "Lanzador · cuatro Cy Young consecutivos con Arizona",
        highlight: "Fue co-MVP de la Serie Mundial de 2001, lanzó un juego perfecto en 2004 y representó a la franquicia en su placa de Cooperstown.",
        url: "https://baseballhall.org/discover-more/news/randy-johnson-cap-selection",
      },
      {
        name: "Luis González",
        era: "1999–2006",
        role: "Jardinero · héroe del título de 2001",
        highlight: "Conectó 57 jonrones en la temporada de 2001 y produjo el imparable que decidió el séptimo juego ante los Yankees. Su número 20 fue retirado.",
        url: DBACKS_RETIRED,
      },
      {
        name: "Brandon Webb",
        era: "2003–2009",
        role: "Lanzador · Cy Young de la Nacional en 2006",
        highlight: "Ganó el Cy Young de 2006 y fue seleccionado tres veces al Juego de Estrellas como pitcher de Arizona.",
        url: DBACKS_AWARDS,
      },
      {
        name: "Paul Goldschmidt",
        era: "2011–2018",
        role: "Primera base · seis Juegos de Estrellas con Arizona",
        highlight: "Se convirtió en uno de los referentes ofensivos del club, ganó el premio Hank Aaron de 2013 y obtuvo varios Guantes de Oro y Bates de Plata.",
        url: DBACKS_AWARDS,
      },
    ],
    immortals: [
      {
        name: "Randy Johnson",
        year: "2015",
        role: "Cooperstown · lanzador · placa con el emblema de Arizona",
        url: "https://baseballhall.org/hall-of-famers/johnson-randy",
      },
    ],
    sources: [
      { label: "Cronología de Arizona", url: DBACKS_TIMELINE },
      { label: "Postemporada y banderines", url: DBACKS_POSTSEASON },
      { label: "Premios y protagonistas", url: DBACKS_AWARDS },
      { label: "Dorsales retirados", url: DBACKS_RETIRED },
      { label: "Historia de Chase Field", url: DBACKS_STADIUM },
      { label: "Cooperstown: Randy Johnson", url: "https://baseballhall.org/hall-of-famers/johnson-randy" },
    ],
  },
  144: {
    intro: "La historia de los Braves comenzó en Boston en 1871 con los Red Stockings, que entraron a la Liga Nacional en 1876. La franquicia se trasladó a Milwaukee en 1953 y a Atlanta en 1966. Ganó la Serie Mundial en las tres ciudades: Boston (1914), Milwaukee (1957) y Atlanta (1995 y 2021).",
    featuredStory: {
      kicker: "REPORTAJE · CAMPEONES DE MLB 2021",
      title: "ATLANTA VOLVIÓ A SER CAMPEÓN DE LA SERIE MUNDIAL",
      excerpt: "Los Braves derrotaron 7-0 a Houston en el sexto juego de 2021 y consiguieron el cuarto título mundial de su histórica franquicia, el segundo desde que juega en Atlanta.",
      url: "https://www.mlb.com/braves/news/braves-win-world-series-2021",
    },
    // 1871 es el origen profesional en la National Association; 1876 es el debut en la National League.
    debutYear: "1876",
    worldSeriesTitles: 4,
    worldSeriesWinningYears: ["1914", "1957", "1995", "2021"],
    titlesVerifiedThrough: "2026",
    pennants: ["1877", "1878", "1883", "1891", "1892", "1893", "1897", "1898",
      "1914", "1948", "1957", "1958", "1991", "1992", "1995", "1996", "1999", "2021"],
    postseasonSource: BRAVES_POSTSEASON,
    divisionTitles: ["1969", "1982", "1991", "1992", "1993", "1995", "1996", "1997",
      "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2013",
      "2018", "2019", "2020", "2021", "2022", "2023"],
    divisionTitlesLabel: "Títulos divisionales (23, sin contar la campaña inconclusa de 1994)",
    stadiumOpened: "2017",
    stadiumOpenedNote: "Truist Park abrió el 14 de abril de 2017 con el nombre SunTrust Park. Reemplazó a Turner Field y adoptó su denominación actual en 2020. El club jugó anteriormente en estadios de Boston, Milwaukee y Atlanta.",
    stadiumSource: "https://www.mlb.com/braves/news/truist-park-best-moments",
    milestones: [
      {
        year: "1871",
        title: "Nacen los Boston Red Stockings",
        description: "El club se constituye en Boston y participa como fundador de la National Association, antecedente de la Liga Nacional.",
        url: BRAVES_STORY,
      },
      {
        year: "1876",
        title: "Debut en la Liga Nacional",
        description: "Boston se incorpora a la nueva Liga Nacional y gana su primer partido, el 22 de abril, ante Philadelphia Athletics.",
        url: BRAVES_TIMELINE,
      },
      {
        year: "1914",
        title: "El milagro de Boston",
        description: "Tras una notable remontada en la temporada, los llamados Miracle Braves barren 4-0 a los Athletics en la Serie Mundial.",
        url: "https://www.mlb.com/postseason/history/1914",
      },
      {
        year: "1953–1957",
        title: "Milwaukee recibe a los Braves y celebra un título",
        description: "La franquicia deja Boston en 1953. Cuatro años después, con Hank Aaron y Warren Spahn, supera a los Yankees en siete juegos.",
        url: BRAVES_STORY,
      },
      {
        year: "1966–1974",
        title: "Atlanta y el histórico jonrón 715",
        description: "El equipo se muda a Atlanta en 1966; el 8 de abril de 1974 Hank Aaron conecta el cuadrangular 715 y supera la marca de Babe Ruth.",
        url: "https://baseballhall.org/hall-of-famers/aaron-hank",
      },
      {
        year: "1995",
        title: "Primera Serie Mundial ganada en Atlanta",
        description: "Con la rotación liderada por Greg Maddux, Tom Glavine y John Smoltz, derrota 4-2 a Cleveland y termina una larga espera.",
        url: "https://www.mlb.com/postseason/history/1995",
      },
      {
        year: "2017",
        title: "Inauguración de Truist Park",
        description: "El 14 de abril abre SunTrust Park, hoy Truist Park, con una victoria 5-2 ante San Diego.",
        url: "https://www.mlb.com/braves/news/truist-park-best-moments",
      },
      {
        year: "2021",
        title: "Cuarta corona de Serie Mundial",
        description: "Atlanta conquista su segundo campeonato desde la mudanza de 1966 al vencer 4-2 a Houston en el Clásico de Otoño.",
        url: "https://www.mlb.com/braves/news/braves-win-world-series-2021",
      },
      {
        year: "2026",
        title: "Andruw Jones entra a Cooperstown",
        description: "El histórico jardinero central, ganador de diez Guantes de Oro, ingresa al Salón de la Fama del Béisbol.",
        url: "https://baseballhall.org/hall-of-famers/jones-andruw",
      },
    ],
    legends: [
      {
        name: "Hank Aaron",
        era: "1954–1974",
        role: "Jardinero · MVP de la Liga Nacional 1957",
        highlight: "Ganó la Serie Mundial de 1957 en Milwaukee y rompió el récord de Babe Ruth con su jonrón 715 en Atlanta en 1974.",
        url: "https://baseballhall.org/hall-of-famers/aaron-hank",
      },
      {
        name: "Warren Spahn",
        era: "1942 y 1946–1964",
        role: "Lanzador zurdo · campeón en Milwaukee",
        highlight: "Figura central de la rotación de los Braves durante sus etapas en Boston y Milwaukee; obtuvo el Cy Young en 1957.",
        url: "https://baseballhall.org/hall-of-famers/spahn-warren",
      },
      {
        name: "Greg Maddux",
        era: "1993–2003",
        role: "Lanzador · cuatro Cy Young consecutivos en total",
        highlight: "Lideró el pitcheo de la dinastía de los años noventa. En 1995 registró 19 victorias y efectividad de 1.63.",
        url: "https://baseballhall.org/hall-of-famers/maddux-greg",
      },
      {
        name: "Chipper Jones",
        era: "1993 y 1995–2012",
        role: "Tercera base · MVP de la Nacional 1999",
        highlight: "Dedicó toda su carrera de Grandes Ligas a Atlanta, fue ocho veces convocado al Juego de Estrellas y obtuvo un título de bateo.",
        url: "https://baseballhall.org/hall-of-famers/jones-chipper",
      },
      {
        name: "John Smoltz",
        era: "1988–2008",
        role: "Lanzador · abridor y cerrador",
        highlight: "Pieza clave de la rotación de los noventa y el título de 1995; destacó tanto en aperturas como en labores de relevo.",
        url: "https://baseballhall.org/hall-of-famers/smoltz-john",
      },
      {
        name: "Andruw Jones",
        era: "1996–2007",
        role: "Jardinero central · diez Guantes de Oro",
        highlight: "Defensor emblemático de Atlanta, conectó dos jonrones en el primer juego de la Serie Mundial de 1996 e ingresó a Cooperstown en 2026.",
        url: "https://baseballhall.org/hall-of-famers/jones-andruw",
      },
    ],
    immortals: [
      { name: "Warren Spahn", year: "1973", role: "Cooperstown · lanzador · Boston/Milwaukee", url: "https://baseballhall.org/hall-of-famers/spahn-warren" },
      { name: "Eddie Mathews", year: "1978", role: "Cooperstown · tercera base · Boston/Milwaukee/Atlanta", url: "https://baseballhall.org/hall-of-famers/mathews-eddie" },
      { name: "Hank Aaron", year: "1982", role: "Cooperstown · jardinero · Milwaukee/Atlanta", url: "https://baseballhall.org/hall-of-famers/aaron-hank" },
      { name: "Greg Maddux", year: "2014", role: "Cooperstown · lanzador de Atlanta", url: "https://baseballhall.org/hall-of-famers/maddux-greg" },
      { name: "Tom Glavine", year: "2014", role: "Cooperstown · lanzador de Atlanta", url: "https://baseballhall.org/hall-of-famers/glavine-tom" },
      { name: "John Smoltz", year: "2015", role: "Cooperstown · lanzador de Atlanta", url: "https://baseballhall.org/hall-of-famers/smoltz-john" },
      { name: "Chipper Jones", year: "2018", role: "Cooperstown · tercera base de Atlanta", url: "https://baseballhall.org/hall-of-famers/jones-chipper" },
      { name: "Andruw Jones", year: "2026", role: "Cooperstown · jardinero central de Atlanta", url: "https://baseballhall.org/hall-of-famers/jones-andruw" },
    ],
    sources: [
      { label: "Origen y etapas de la franquicia", url: BRAVES_STORY },
      { label: "Cronología oficial", url: BRAVES_TIMELINE },
      { label: "Palmarés de postemporada", url: BRAVES_POSTSEASON },
      { label: "Campeonato mundial de 2021", url: "https://www.mlb.com/braves/news/braves-win-world-series-2021" },
      { label: "Estadios y mudanzas", url: BRAVES_BALLPARKS },
      { label: "Dorsales retirados", url: BRAVES_RETIRED },
      { label: "Leyendas en Cooperstown", url: BRAVES_HOF },
      { label: "Entronización de Andruw Jones 2026", url: "https://baseballhall.org/hall-of-famers/jones-andruw" },
    ],
  },
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
    postseasonSource: RAYS_POSTSEASON,
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
    pennantSources: {
      "1982": "https://www.mlb.com/postseason/history/1982",
      "2026": "https://www.mlb.com/postseason/history/2026",
    },
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
