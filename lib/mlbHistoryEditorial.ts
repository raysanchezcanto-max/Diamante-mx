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
  pennantClubNames?: Readonly<Record<string, string>>;
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
const ORIOLES_TIMELINE = "https://www.mlb.com/orioles/history/timeline";
const ORIOLES_POSTSEASON = "https://www.mlb.com/orioles/history/postseason-results";
const ORIOLES_RETIRED = "https://www.mlb.com/orioles/history/retired-numbers";
const ORIOLES_BALLPARKS = "https://www.mlb.com/orioles/history/ballparks";
const ORIOLES_HOF = "https://www.mlb.com/orioles/history/hall-of-fame-players";

const REDSOX_TIMELINE = "https://www.mlb.com/redsox/history/timeline";
const REDSOX_POSTSEASON = "https://www.mlb.com/redsox/history/postseason-results";
const REDSOX_HOF = "https://www.mlb.com/redsox/history/hall-of-famers";
const REDSOX_RETIRED = "https://www.mlb.com/redsox/history/retired-numbers";
const REDSOX_FENWAY = "https://www.mlb.com/redsox/ballpark/facts-figures";

const CUBS_TIMELINE = "https://www.mlb.com/cubs/history/timeline";
const CUBS_HISTORY = "https://www.mlb.com/cubs/history";
const CUBS_BALLPARKS = "https://www.mlb.com/cubs/history/ballparks";
const CUBS_HALL = "https://www.mlb.com/cubs/history/hall-of-fame-players";
const CUBS_POSTSEASON = "https://www.mlb.com/postseason/history";

const WHITE_SOX_TIMELINE = "https://www.mlb.com/whitesox/history/timeline";
const WHITE_SOX_HALL = "https://www.mlb.com/whitesox/history/hall-of-famers";
const WHITE_SOX_STADIUM = "https://www.mlb.com/whitesox/ballpark/information/history-and-dimensions";
const WHITE_SOX_2005 = "https://www.mlb.com/whitesox/news/2005-world-series-recap";

const REDS_TIMELINE = "https://www.mlb.com/reds/history/timeline";
const REDS_POSTSEASON = "https://www.mlb.com/reds/history/postseason-results";
const REDS_HALL = "https://www.mlb.com/reds/history/records-stats-awards/hall-of-famers";
const REDS_NUMBERS = "https://www.mlb.com/reds/history/records-stats-awards/retired-numbers";
const REDS_STADIUM = "https://www.mlb.com/reds/ballpark/information/facts";
const REDS_1990 = "https://www.mlb.com/reds/news/1990-world-series-recap";

const GUARDIANS_TIMELINE = "https://www.mlb.com/guardians/history/timeline";
const GUARDIANS_POSTSEASON = "https://www.mlb.com/guardians/history/postseason-results";
const GUARDIANS_HALL = "https://www.mlb.com/guardians/history/hall-of-fame";
const GUARDIANS_RETIRED = "https://www.mlb.com/guardians/history/retired-numbers";
const GUARDIANS_BALLPARK = "https://www.mlb.com/guardians/ballpark/information/history";
const GUARDIANS_DIVISION_2026 = "https://www.mlb.com/guardians/news/guardians-clinch-2026-al-central-title";

const ROCKIES_TIMELINE = "https://www.mlb.com/rockies/history/timeline";
const ROCKIES_BALLPARK = "https://www.mlb.com/rockies/ballpark/history";
const ROCKIES_RETIRED = "https://www.mlb.com/rockies/history/retired-numbers";
const ROCKIES_POSTSEASON = "https://www.mlb.com/rockies/history/postseason-results";
const ROCKIES_HELTON = "https://www.mlb.com/rockies/fans/todd-helton-hall-of-fame";

const histories: Readonly<Record<number, MlbEditorialHistory>> = {
  119: {
    intro: "La franquicia nació en Brooklyn en 1884 y se incorporó a la Liga Nacional en 1890. Con Jackie Robinson rompió la barrera racial de Grandes Ligas en 1947, ganó su primera Serie Mundial en Brooklyn en 1955 y se trasladó a Los Ángeles en 1958. Desde 1962 juega en Dodger Stadium. Sus nueve coronas, la Fernandomanía y el bicampeonato de 2024–2025 marcan una de las historias más influyentes del béisbol.",
    featuredStory: {
      kicker: "HISTORIA · BICAMPEONES 2024–2025",
      title: "NUEVE CORONAS Y UNA HISTORIA QUE UNE BROOKLYN, LOS ÁNGELES Y MÉXICO",
      excerpt: "Los Dodgers conquistaron la Serie Mundial de 2025 en siete juegos frente a Toronto: Yoshinobu Yamamoto provocó una doble matanza para sellar el bicampeonato. Décadas antes, Fernando Valenzuela había unido a generaciones de aficionados mexicanos y angelinos con la Fernandomanía de 1981.",
      url: "https://www.mlb.com/dodgers/video/yoshinobu-yamamoto-in-play-out-s-to-alejandro-kirk",
    },
    debutYear: "1890",
    worldSeriesTitles: 9,
    worldSeriesWinningYears: ["1955", "1959", "1963", "1965", "1981", "1988", "2020", "2024", "2025"],
    titlesVerifiedThrough: "2026",
    pennants: ["1916", "1920", "1941", "1947", "1949", "1952", "1953", "1955", "1956", "1959", "1963", "1965", "1966", "1974", "1977", "1978", "1981", "1988", "2017", "2018", "2020", "2024", "2025"],
    postseasonSource: "https://www.mlb.com/dodgers/history/postseason-results",
    divisionTitles: ["1974", "1977", "1978", "1981", "1983", "1985", "1988", "1995", "1996", "2004", "2006", "2008", "2009", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2022", "2023", "2024", "2025"],
    divisionTitlesLabel: "Títulos divisionales históricos documentados",
    stadiumOpened: "1962",
    stadiumOpenedNote: "Dodger Stadium abrió en 1962 en Chavez Ravine y es el hogar de la franquicia desde entonces. Antes del traslado de 1958, Brooklyn jugó durante décadas en Ebbets Field.",
    stadiumSource: "https://www.mlb.com/dodgers/history/ballparks",
    milestones: [
      {year: "1884–1890", title: "Las raíces de Brooklyn", description: "La franquicia comienza en Brooklyn en 1884 y entra en la Liga Nacional en 1890; décadas después quedaría identificada con el nombre Dodgers.", url: "https://www.mlb.com/dodgers/history/ballparks"},
      {year: "1947", title: "Jackie Robinson transforma el deporte", description: "Robinson rompe la barrera racial de la era moderna de MLB con Brooklyn, cambiando la historia deportiva y social de Estados Unidos.", url: "https://baseballhall.org/hall-of-famers/robinson-jackie"},
      {year: "1955", title: "Brooklyn conquista su primera Serie Mundial", description: "Los Dodgers derrotan a los Yankees y festejan la corona que tanto había esperado Brooklyn.", url: "https://www.mlb.com/dodgers/history/postseason-results"},
      {year: "1958–1962", title: "Nuevo capítulo en Los Ángeles", description: "La organización se muda al oeste en 1958 y estrena Dodger Stadium en 1962.", url: "https://www.mlb.com/dodgers/history/ballparks"},
      {year: "1963–1965", title: "La era de Sandy Koufax", description: "El extraordinario zurdo encabeza una generación que gana las Series Mundiales de 1963 y 1965.", url: "https://baseballhall.org/hall-of-famers/koufax-sandy"},
      {year: "1981", title: "Fernandomanía y campeonato", description: "Fernando Valenzuela, formado en México, gana el premio Cy Young y el de Novato del Año en una temporada que culmina con la Serie Mundial.", url: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon"},
      {year: "1988", title: "El jonrón imposible de Kirk Gibson", description: "Lesionado y como emergente, Gibson conecta un cuadrangular para dejar en el terreno a Oakland en el Juego 1; los Dodgers ganan la Serie Mundial.", url: "https://www.mlb.com/video/gibson-s-pinch-hit-hr-c3731660"},
      {year: "2020", title: "El regreso a la cima", description: "Los Dodgers vencen a Tampa Bay y rompen una sequía de 32 años sin Serie Mundial.", url: "https://www.mlb.com/dodgers/history/postseason-results"},
      {year: "2024", title: "Octava corona ante los Yankees", description: "Los Ángeles remonta una desventaja de cinco carreras en el quinto juego y cierra la Serie Mundial contra Nueva York.", url: "https://www.mlb.com/video/dodgers-overcome-5-run-deficit-to-win-world-series"},
      {year: "2025", title: "Bicampeonato de película", description: "En once entradas del séptimo juego frente a Toronto, los Dodgers sellan su novena corona y su segundo campeonato consecutivo.", url: "https://www.mlb.com/dodgers/video/yoshinobu-yamamoto-in-play-out-s-to-alejandro-kirk"},
    ],
    legends: [
      {name: "Jackie Robinson", era: "1947–1956", role: "Segunda base · pionero histórico", highlight: "Abrió las puertas del béisbol de Grandes Ligas a una nueva generación al debutar con Brooklyn en 1947.", url: "https://baseballhall.org/hall-of-famers/robinson-jackie"},
      {name: "Sandy Koufax", era: "1955–1966", role: "Lanzador zurdo · tres premios Cy Young", highlight: "Su dominio en la lomita definió a los Dodgers campeones de la década de 1960.", url: "https://baseballhall.org/hall-of-famers/koufax-sandy"},
      {name: "Fernando Valenzuela", era: "1980–1990", role: "Lanzador mexicano · Cy Young y Novato del Año 1981", highlight: "Desde Etchohuaquila y los diamantes de Yucatán hasta Los Ángeles: la Fernandomanía trascendió el deporte.", url: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon"},
      {name: "Kirk Gibson", era: "1988–1990", role: "Jardinero · héroe de la Serie Mundial de 1988", highlight: "Su jonrón como bateador emergente es una de las imágenes más inolvidables de octubre.", url: "https://www.mlb.com/video/gibson-s-pinch-hit-hr-c3731660"},
      {name: "Clayton Kershaw", era: "2008–2025", role: "Lanzador zurdo · tres Cy Young", highlight: "Figura central de la era moderna y de los campeonatos de 2020, 2024 y 2025.", url: "https://www.mlb.com/dodgers/history/postseason-results"},
      {name: "Shohei Ohtani", era: "2024–presente", role: "Bateador y lanzador · figura contemporánea", highlight: "Su llegada impulsó una nueva etapa de talento internacional y un histórico bicampeonato.", url: "https://www.mlb.com/dodgers/history/postseason-results"},
    ],
    immortals: [
      {name: "Jackie Robinson", year: "1962", role: "Cooperstown · segunda base; Brooklyn 1947–1956", url: "https://baseballhall.org/hall-of-famers/robinson-jackie"},
      {name: "Sandy Koufax", year: "1972", role: "Cooperstown · lanzador; Dodgers 1955–1966", url: "https://baseballhall.org/hall-of-famers/koufax-sandy"},
      {name: "Roy Campanella", year: "1969", role: "Cooperstown · receptor; Brooklyn 1948–1957", url: "https://baseballhall.org/hall-of-famers/campanella-roy"},
      {name: "Duke Snider", year: "1980", role: "Cooperstown · jardinero; Dodgers 1947–1962", url: "https://baseballhall.org/hall-of-famers/snider-duke"},
      {name: "Don Drysdale", year: "1984", role: "Cooperstown · lanzador; Dodgers 1956–1969", url: "https://baseballhall.org/hall-of-famers/drysdale-don"},
      {name: "Don Sutton", year: "1998", role: "Cooperstown · lanzador; Dodgers 1966–1980 y 1988", url: "https://baseballhall.org/hall-of-famers/sutton-don"},
    ],
    sources: [
      {label: "Historial oficial de postemporadas de los Dodgers", url: "https://www.mlb.com/dodgers/history/postseason-results"},
      {label: "Estadios de Brooklyn y Los Ángeles", url: "https://www.mlb.com/dodgers/history/ballparks"},
      {label: "MLB: novena Serie Mundial y bicampeonato de 2025", url: "https://www.mlb.com/dodgers/video/yoshinobu-yamamoto-in-play-out-s-to-alejandro-kirk"},
      {label: "LMB: trayectoria mexicana de Fernando Valenzuela", url: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon"},
    ],
  },
  108: {
    intro: "Los Angels nacieron en 1961 como franquicia de expansión de la Liga Americana y han representado a Los Ángeles y Anaheim bajo varios nombres. Desde 1966 juegan en Angel Stadium, inaugurado como Anaheim Stadium. Su primer título divisional llegó en 1979 y el mayor logro de la organización fue la Serie Mundial de 2002, ganada en siete juegos a San Francisco.",
    featuredStory: {
      kicker: "HISTORIA · CAMPEONES DEL 2002",
      title: "LA REMONTADA QUE CAMBIÓ LA HISTORIA DE LOS ANGELS",
      excerpt: "Los Angels remontaron una desventaja de cinco carreras en el sexto juego ante San Francisco y después ganaron 4–1 el séptimo encuentro. Troy Glaus fue el Jugador Más Valioso de la Serie Mundial y Troy Percival consiguió el último out.",
      url: "https://www.mlb.com/angels/video/angels-win-2002-world-series",
    },
    debutYear: "1961",
    worldSeriesTitles: 1,
    worldSeriesWinningYears: ["2002"],
    titlesVerifiedThrough: "2026",
    pennants: ["2002"],
    pennantLeagues: {"2002": "Liga Americana"},
    postseasonSource: "https://www.mlb.com/angels/history/timeline",
    divisionTitles: ["1979", "1982", "1986", "2004", "2005", "2007", "2008", "2009", "2014"],
    stadiumOpened: "1966",
    stadiumOpenedNote: "El actual Angel Stadium abrió en Anaheim en 1966 como Anaheim Stadium. Anteriormente, el equipo jugó en Wrigley Field de Los Ángeles (1961) y en Dodger Stadium (1962–1965); el estadio también recibió el nombre Edison International Field.",
    stadiumSource: "https://www.mlb.com/angels/history/ballparks",
    milestones: [
      {year: "1961", title: "Nace la franquicia de los Angels", description: "Los Angeles Angels debutan en la Liga Americana y disputan sus partidos de casa en Wrigley Field de Los Ángeles.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "1966", title: "Un hogar permanente en Anaheim", description: "El equipo estrena el nuevo Anaheim Stadium, hoy Angel Stadium, tras cuatro temporadas en Dodger Stadium.", url: "https://www.mlb.com/angels/history/ballparks"},
      {year: "1973–1975", title: "Nolan Ryan domina desde la lomita", description: "Ryan lanza cuatro juegos sin hit ni carrera con los Angels entre 1973 y 1975 y construye su leyenda como ponchador.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "1979", title: "Primer título de división", description: "Con Don Baylor, MVP de la Liga Americana, los Angels conquistan por primera vez el Oeste y avanzan a la Serie de Campeonato.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "1982", title: "Nueva corona del Oeste", description: "La generación de veteranos con Bobby Grich y Reggie Jackson vuelve a conducir a Anaheim a la postemporada.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "1986", title: "A las puertas de la Serie Mundial", description: "Los Angels ganan su tercera división, aunque Boston los elimina en una dramática Serie de Campeonato.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "2002", title: "Primer banderín y campeonato mundial", description: "Los Angels superan a los Giants en siete juegos de Serie Mundial; Troy Glaus es el MVP y Troy Percival cierra el séptimo juego.", url: "https://www.mlb.com/angels/video/angels-win-2002-world-series"},
      {year: "2004–2009", title: "Dominio divisional en la era de Scioscia", description: "Con Vladimir Guerrero, Francisco Rodríguez y otros referentes, el equipo obtiene cinco títulos del Oeste en seis campañas.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "2014", title: "La temporada de 98 victorias", description: "Mike Trout impulsa a los Angels a la mejor marca de MLB, pero Kansas City los elimina en la Serie Divisional.", url: "https://www.mlb.com/angels/history/timeline"},
      {year: "2018", title: "Shohei Ohtani deslumbra en dos funciones", description: "Ohtani combina pitcheo y bateo de poder en su año de debut y conquista el premio al Novato del Año de la Americana.", url: "https://www.mlb.com/angels/history/timeline"},
    ],
    legends: [
      {name: "Nolan Ryan", era: "1972–1979", role: "Lanzador · cuatro juegos sin hit con Angels", highlight: "Convirtió el pitcheo de poder y los ponches en una parte esencial de la identidad del club.", url: "https://www.mlb.com/angels/history/timeline"},
      {name: "Tim Salmon", era: "1992–2006", role: "Jardinero · campeón de 2002", highlight: "Referente ofensivo de toda una generación y protagonista del único título mundial del club.", url: "https://www.mlb.com/angels/history/timeline"},
      {name: "Garret Anderson", era: "1994–2008", role: "Jardinero · campeón de 2002", highlight: "Bateador consistente y pieza central de la ofensiva de la primera corona.", url: "https://www.mlb.com/angels/history/timeline"},
      {name: "Vladimir Guerrero", era: "2004–2009", role: "Jardinero · MVP Americana 2004", highlight: "Su bate impulsó las múltiples conquistas divisionales de la década de 2000.", url: "https://www.mlb.com/angels/history/timeline"},
      {name: "Mike Trout", era: "2011–presente", role: "Jardinero · tres premios MVP", highlight: "La figura moderna de la franquicia y uno de los grandes talentos de su generación.", url: "https://www.mlb.com/angels/history/timeline"},
      {name: "Shohei Ohtani", era: "2018–2023", role: "Bateador y lanzador · Novato del Año 2018", highlight: "Revolucionó el béisbol moderno con su excepcional juego de doble función durante su paso por Anaheim.", url: "https://www.mlb.com/angels/history/timeline"},
    ],
    immortals: [
      {name: "Nolan Ryan", year: "1999", role: "Cooperstown · lanzador; Angels 1972–1979", url: "https://baseballhall.org/hall-of-famers/ryan-nolan"},
      {name: "Reggie Jackson", year: "1993", role: "Cooperstown · jardinero y bateador designado; Angels 1982–1986", url: "https://baseballhall.org/hall-of-famers/jackson-reggie"},
      {name: "Vladimir Guerrero", year: "2018", role: "Cooperstown · jardinero; Angels 2004–2009", url: "https://baseballhall.org/hall-of-famers/guerrero-vladimir"},
      {name: "Rod Carew", year: "1991", role: "Cooperstown · primera base; Angels 1979–1985", url: "https://baseballhall.org/hall-of-famers/carew-rod"},
    ],
    sources: [
      {label: "Cronología oficial de los Angels", url: "https://www.mlb.com/angels/history/timeline"},
      {label: "Estadios históricos de los Angels", url: "https://www.mlb.com/angels/history/ballparks"},
      {label: "Último out de la Serie Mundial 2002", url: "https://www.mlb.com/angels/video/angels-win-2002-world-series"},
    ],
  },

  118: {
    intro: "Kansas City debutó como franquicia de expansión de la Liga Americana en 1969. Tras sus primeras temporadas en Municipal Stadium, estrenó en 1973 el actual Kauffman Stadium, una de las señas de identidad del club. La época de George Brett convirtió a los Royals en protagonistas de octubre; ganaron las Series Mundiales de 1985 y 2015, además de disputar los clásicos de 1980 y 2014.",
    featuredStory: {
      kicker: "HISTORIA · LA CORONA DE 2015",
      title: "TREINTA AÑOS DESPUÉS, KANSAS CITY VOLVIÓ A REINAR",
      excerpt: "Después de quedarse a un triunfo del campeonato en 2014, los Royals regresaron a la Serie Mundial de 2015 y derrotaron a New York Mets en cinco juegos. Salvador Pérez fue nombrado Jugador Más Valioso de la serie.",
      url: "https://www.mlb.com/royals/video/royals-win-the-2015-world-series-c527664183",
    },
    debutYear: "1969",
    worldSeriesTitles: 2,
    worldSeriesWinningYears: ["1985", "2015"],
    titlesVerifiedThrough: "2026",
    pennants: ["1980", "1985", "2014", "2015"],
    pennantLeagues: {"1980": "Liga Americana", "1985": "Liga Americana", "2014": "Liga Americana", "2015": "Liga Americana"},
    postseasonSource: "https://www.mlb.com/royals/history/timeline-2010s",
    divisionTitles: ["1976", "1977", "1978", "1980", "1981", "1984", "1985", "2015"],
    stadiumOpened: "1973",
    stadiumOpenedNote: "El estadio abrió el 10 de abril de 1973 como Royals Stadium y fue renombrado Kauffman Stadium el 2 de julio de 1993 en honor al fundador Ewing Kauffman. El club había jugado en Municipal Stadium entre 1969 y 1972.",
    stadiumSource: "https://www.mlb.com/royals/history/ballparks",
    milestones: [
      {year: "1969", title: "Debut de una nueva franquicia", description: "Los Royals juegan su primer partido de Grandes Ligas en Municipal Stadium como nuevo club de expansión de la Liga Americana.", url: "https://www.mlb.com/royals/history/timeline-1960s"},
      {year: "1973", title: "Se inaugura el estadio de los Royals", description: "Abre Royals Stadium, hoy Kauffman Stadium, que se convertirá en el hogar permanente del equipo.", url: "https://www.mlb.com/royals/history/ballparks"},
      {year: "1976–1978", title: "Primera gran dinastía divisional", description: "Bajo Whitey Herzog, Kansas City conquista tres veces consecutivas el Oeste de la Americana, con George Brett como referente.", url: "https://www.mlb.com/royals/history/timeline-1970s"},
      {year: "1980", title: "Primer banderín de la Americana", description: "George Brett conecta un histórico jonrón ante los Yankees y los Royals llegan a su primera Serie Mundial; Philadelphia gana en seis partidos.", url: "https://www.mlb.com/royals/history/timeline-1980s"},
      {year: "1985", title: "Primer campeonato del mundo", description: "Kansas City remonta la Serie Mundial contra St. Louis después de ir abajo 3–1; Bret Saberhagen blanquea el séptimo juego.", url: "https://www.mlb.com/royals/video/royals-win-1985-world-series-c20084983"},
      {year: "1993", title: "El estadio recibe el nombre Kauffman", description: "La organización honra a su fundador Ewing M. Kauffman al renombrar oficialmente el parque.", url: "https://www.mlb.com/royals/history/ballparks"},
      {year: "2014", title: "Una remontada que desata la magia de octubre", description: "Kansas City supera 9–8 a Oakland en doce entradas en el Juego de Comodines y vuelve a la Serie Mundial, donde cae ante San Francisco en siete partidos.", url: "https://www.mlb.com/video/royals-win-2014-al-wild-card-game"},
      {year: "2015", title: "Segunda corona mundial", description: "Los Royals vencen a New York Mets en cinco partidos y Salvador Pérez se lleva el premio al Jugador Más Valioso de la Serie Mundial.", url: "https://www.mlb.com/royals/video/royals-win-the-2015-world-series-c527664183"},
      {year: "2024", title: "Regreso a postemporada", description: "Con Bobby Witt Jr. y Salvador Pérez como figuras, el equipo regresa a octubre y supera a Baltimore en la Serie de Comodines.", url: "https://www.mlb.com/royals/history/timeline-2020s"},
      {year: "2026", title: "Una campaña de reconstrucción", description: "Los Royals concluyen la fase regular con marca de 69–93 en la División Central de la Liga Americana.", url: "https://www.mlb.com/royals/standings/2026"},
    ],
    legends: [
      {name: "George Brett", era: "1973–1993", role: "Tercera base · Cooperstown 1999", highlight: "El gran símbolo de Kansas City: 3,154 imparables, tres títulos de bateo y el MVP de la Americana en 1980.", url: "https://baseballhall.org/hall-of-famers/brett-george"},
      {name: "Frank White", era: "1973–1990", role: "Segunda base · ocho Guantes de Oro", highlight: "Figura defensiva emblemática y pieza fundamental del campeonato de 1985.", url: "https://www.mlb.com/royals/hall-of-fame/members"},
      {name: "Bret Saberhagen", era: "1984–1991", role: "Lanzador · dos premios Cy Young", highlight: "MVP de la Serie Mundial de 1985 gracias a su dominio desde la lomita, incluido el cierre del séptimo juego.", url: "https://www.mlb.com/royals/history/timeline-1980s"},
      {name: "Bo Jackson", era: "1986–1990", role: "Jardinero · estrella de dos deportes", highlight: "Una de las figuras atléticas más espectaculares de la franquicia y del deporte estadounidense.", url: "https://www.mlb.com/royals/hall-of-fame/members"},
      {name: "Salvador Pérez", era: "2011–presente", role: "Receptor · MVP Serie Mundial 2015", highlight: "Líder del equipo campeón de 2015 y referente de la franquicia durante más de una década.", url: "https://www.mlb.com/royals/history/timeline-2010s"},
      {name: "Bobby Witt Jr.", era: "2022–presente", role: "Campocorto · generación actual", highlight: "Talento central del regreso a postemporada en 2024 y del futuro deportivo de Kansas City.", url: "https://www.mlb.com/royals/history/timeline-2020s"},
    ],
    immortals: [
      {name: "George Brett", year: "1999", role: "Cooperstown · tercera base; toda su carrera en Kansas City", url: "https://baseballhall.org/hall-of-famers/brett-george"},
      {name: "Whitey Herzog", year: "2010", role: "Cooperstown · mánager de los Royals de 1975 a 1979", url: "https://baseballhall.org/hall-of-famers/herzog-whitey"},
    ],
    sources: [
      {label: "Cronología oficial de los sesenta", url: "https://www.mlb.com/royals/history/timeline-1960s"},
      {label: "Cronología oficial de los ochenta", url: "https://www.mlb.com/royals/history/timeline-1980s"},
      {label: "Cronología oficial de la era campeona moderna", url: "https://www.mlb.com/royals/history/timeline-2010s"},
      {label: "Historia de Kauffman Stadium", url: "https://www.mlb.com/royals/history/ballparks"},
      {label: "Salón de la Fama de los Royals", url: "https://www.mlb.com/royals/hall-of-fame/members"},
      {label: "Clasificación 2026 en MLB", url: "https://www.mlb.com/royals/standings/2026"},
    ],
  },

  117: {
    intro: "Houston comenzó su historia de Grandes Ligas en 1962 como los Colt .45s y adoptó el nombre Astros en 1965 al mudarse al innovador Astrodome. Compitió en la Liga Nacional hasta 2012 y pasó a la Americana en 2013, convirtiéndose en una de las pocas franquicias con banderines en ambas ligas. Ganó las Series Mundiales de 2017 y 2022 y juega en Daikin Park desde 2000, cuando el inmueble abrió como Enron Field.",
    featuredStory: {
      kicker: "HISTORIA · CAMPEONES DE 2022",
      title: "EL SEGUNDO TÍTULO Y UNA SERIE MUNDIAL INOLVIDABLE",
      excerpt: "En 2022, los Astros vencieron a Philadelphia en seis juegos. Su pitcheo consiguió un juego sin hit ni carrera combinado en el cuarto encuentro y Kyle Tucker atrapó el último out de la serie, bajo la dirección de Dusty Baker.",
      url: "https://www.mlb.com/astros/video/astros-win-the-world-series",
    },
    debutYear: "1962",
    worldSeriesTitles: 2,
    worldSeriesWinningYears: ["2017", "2022"],
    titlesVerifiedThrough: "2026",
    pennants: ["2005", "2017", "2019", "2021", "2022"],
    pennantLeagues: {"2005": "Liga Nacional", "2017": "Liga Americana", "2019": "Liga Americana", "2021": "Liga Americana", "2022": "Liga Americana"},
    postseasonSource: "https://www.mlb.com/astros/history/timeline",
    divisionTitles: ["1980", "1986", "1997", "1998", "1999", "2001", "2017", "2018", "2019", "2021", "2022", "2023", "2024", "2026"],
    stadiumOpened: "2000",
    stadiumOpenedNote: "El estadio abrió el 7 de abril de 2000 como Enron Field, se llamó Minute Maid Park entre 2002 y 2024 y adoptó el nombre Daikin Park en 2025. Antes, el club jugaba en el Astrodome desde 1965.",
    stadiumSource: "https://www.mlb.com/astros/ballpark/information/facts-and-figures",
    milestones: [
      {year: "1962", title: "Nacen los Houston Colt .45s", description: "La franquicia de expansión debuta en la Liga Nacional bajo el nombre Colt .45s y juega sus primeros años al aire libre.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "1965", title: "Un nombre espacial y un estadio revolucionario", description: "La franquicia adopta el nombre Astros y se traslada al Astrodome, célebre estadio cubierto de Houston.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "1980", title: "Primer título de división", description: "Con Nolan Ryan, Joe Niekro y José Cruz, Houston gana el Oeste de la Liga Nacional y disputa una dramática Serie de Campeonato ante Philadelphia.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "1986", title: "Otra campaña histórica de pitcheo", description: "Mike Scott gana el Cy Young, lanza un juego sin hit y los Astros vuelven a disputar la Serie de Campeonato de la Nacional.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "1997–1999", title: "Tres divisiones consecutivas", description: "El núcleo de Jeff Bagwell y Craig Biggio gana tres títulos seguidos de la Central de la Liga Nacional.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "2000", title: "Nuevo hogar con techo retráctil", description: "Abre el actual Daikin Park, entonces Enron Field, en el centro de la ciudad y concluye la etapa del Astrodome.", url: "https://www.mlb.com/astros/ballpark/information/facts-and-figures"},
      {year: "2005", title: "Primer banderín y primera Serie Mundial", description: "Roy Oswalt y compañía vencen a St. Louis en la Serie de Campeonato de la Nacional. Chicago White Sox gana la Serie Mundial.", url: "https://www.mlb.com/video/astros-advance-to-world-series-c20047525"},
      {year: "2013", title: "Cambio a la Liga Americana", description: "Houston deja la Liga Nacional después de 51 temporadas y comienza a competir en la División Oeste de la Americana.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "2017", title: "Primera corona mundial", description: "Los Astros superan a Los Angeles Dodgers en siete juegos y conquistan su primer título de Serie Mundial.", url: "https://www.mlb.com/astros/video/astros-win-the-world-series-c1866378083"},
      {year: "2020", title: "Sanciones por el robo electrónico de señas", description: "MLB sanciona a la organización tras investigar el uso indebido de tecnología para descifrar señas durante 2017 y 2018. El título de 2017 no fue retirado.", url: "https://www.mlb.com/news/notable-suspensions-and-discipline-in-baseball-history"},
      {year: "2022", title: "Segunda Serie Mundial", description: "Houston supera a Philadelphia en seis juegos; Cristian Javier inicia el histórico juego sin hit combinado del cuarto partido.", url: "https://www.mlb.com/astros/video/astros-win-the-world-series"},
      {year: "2023", title: "Séptima Serie de Campeonato consecutiva", description: "El club gana el Oeste de la Americana y vuelve a la Serie de Campeonato, pero Texas lo elimina en siete juegos.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "2024", title: "Última corona de una racha divisional", description: "Houston obtiene su cuarto campeonato consecutivo del Oeste de la Americana, antes de caer ante Detroit en la Serie de Comodines.", url: "https://www.mlb.com/astros/history/timeline"},
      {year: "2026", title: "El regreso a octubre", description: "Los Astros ganan el Oeste de la Americana con marca 81–81, pero Chicago White Sox los elimina en la ronda de comodines.", url: "https://www.mlb.com/astros/news/astros-lose-2026-al-wild-card-series"},
    ],
    legends: [
      {name: "José Cruz", era: "1975–1987", role: "Jardinero · dorsal 25 retirado", highlight: "Ídolo puertorriqueño y referencia ofensiva del primer equipo de Houston que ganó un título divisional.", url: "https://www.mlb.com/astros/history/hall-of-fame"},
      {name: "Nolan Ryan", era: "1980–1988", role: "Lanzador · miembro de Cooperstown", highlight: "Una de las grandes figuras del pitcheo y emblema de la generación de los ochenta.", url: "https://www.mlb.com/astros/history/hall-of-fame"},
      {name: "Craig Biggio", era: "1988–2007", role: "Receptor y segunda base · 3,060 imparables", highlight: "Jugó toda su carrera en Houston y protagonizó la primera Serie Mundial del club en 2005.", url: "https://www.mlb.com/astros/history/hall-of-fame"},
      {name: "Jeff Bagwell", era: "1991–2005", role: "Primera base · MVP 1994", highlight: "Junto a Biggio construyó una era ganadora de la Central de la Nacional y llegó a la Serie Mundial de 2005.", url: "https://www.mlb.com/astros/history/hall-of-fame"},
      {name: "José Altuve", era: "2011–presente", role: "Segunda base · MVP 2017", highlight: "Figura de las generaciones campeonas de 2017 y 2022, con numerosos batazos decisivos de postemporada.", url: "https://www.mlb.com/astros/history/timeline"},
      {name: "Justin Verlander", era: "2017–2023, con interrupciones", role: "Lanzador · Cy Young 2019 y 2022", highlight: "Pieza clave de la rotación que ganó las dos Series Mundiales y protagonista de la etapa moderna del club.", url: "https://www.mlb.com/astros/history/timeline"},
    ],
    immortals: [
      {name: "Joe Morgan", year: "1990", role: "Cooperstown · segunda base; jugó con Houston en dos etapas", url: "https://baseballhall.org/hall-of-famers/morgan-joe"},
      {name: "Nolan Ryan", year: "1999", role: "Cooperstown · lanzador; Astros 1980–1988", url: "https://baseballhall.org/hall-of-famers/ryan-nolan"},
      {name: "Craig Biggio", year: "2015", role: "Cooperstown · segunda base y receptor", url: "https://baseballhall.org/hall-of-famers/biggio-craig"},
      {name: "Jeff Bagwell", year: "2017", role: "Cooperstown · primera base", url: "https://baseballhall.org/hall-of-famers/bagwell-jeff"},
    ],
    sources: [
      {label: "Cronología oficial de los Astros", url: "https://www.mlb.com/astros/history/timeline"},
      {label: "Campeonatos divisionales históricos", url: "https://www.mlb.com/press-release/press-release-astros-clinch-american-league-west-division-title-for-seventh-time-in-eight-seasons"},
      {label: "División Oeste 2026", url: "https://www.mlb.com/astros/news/astros-clinch-2026-al-west-title"},
      {label: "Datos históricos de Daikin Park", url: "https://www.mlb.com/astros/ballpark/information/facts-and-figures"},
      {label: "Salón de la Fama de Houston", url: "https://www.mlb.com/astros/history/hall-of-fame"},
      {label: "Investigación y sanciones oficiales", url: "https://www.mlb.com/news/notable-suspensions-and-discipline-in-baseball-history"},
    ],
  },

  116: {
    intro: "Detroit Tigers es una de las franquicias fundadoras de la Liga Americana de 1901. Desde el histórico Ty Cobb hasta Miguel Cabrera, el club ha construido una tradición que incluye once banderines de la Americana y cuatro campeonatos de Serie Mundial: 1935, 1945, 1968 y 1984. Juega en Comerica Park desde 2000, después de casi nueve décadas en Tiger Stadium.",
    featuredStory: {
      kicker: "HISTORIA · LOS TIGRES DE 1984",
      title: "DE UN ARRANQUE DE 35–5 A LA CUARTA CORONA",
      excerpt: "Dirigidos por Sparky Anderson, los Tigers arrancaron 1984 con una marca extraordinaria de 35 victorias y 5 derrotas en sus primeros 40 partidos. Ganaron 104 juegos en temporada regular y vencieron a San Diego Padres en cinco encuentros para conquistar su cuarta Serie Mundial.",
      url: "https://www.mlb.com/tigers/history/timeline",
    },
    debutYear: "1901",
    worldSeriesTitles: 4,
    worldSeriesWinningYears: ["1935", "1945", "1968", "1984"],
    titlesVerifiedThrough: "2026",
    pennants: ["1907", "1908", "1909", "1934", "1935", "1940", "1945", "1968", "1984", "2006", "2012"],
    postseasonSource: "https://www.mlb.com/tigers/history/timeline",
    divisionTitles: ["1972", "1984", "1987", "2011", "2012", "2013", "2014"],
    stadiumOpened: "2000",
    stadiumOpenedNote: "Comerica Park abrió el 11 de abril de 2000 y reemplazó al histórico Tiger Stadium, hogar de los Tigers entre 1912 y 1999.",
    stadiumSource: "https://www.mlb.com/tigers/history/ballparks",
    milestones: [
      {year: "1901", title: "Comienza la aventura en la Liga Americana", description: "Detroit forma parte de los clubes fundadores de la Liga Americana moderna y juega en Bennett Park.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "1907–1909", title: "Tres banderines consecutivos", description: "Con Ty Cobb como gran figura, los Tigers conquistan la Liga Americana tres años seguidos y disputan sus primeras Series Mundiales.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "1912", title: "Un estadio que marcaría generaciones", description: "El club estrena Navin Field, posteriormente conocido como Briggs Stadium y Tiger Stadium.", url: "https://www.mlb.com/tigers/history/ballparks"},
      {year: "1935", title: "Primera Serie Mundial", description: "Detroit derrota a Chicago Cubs y conquista el primer campeonato mundial de su historia, con Hank Greenberg y Mickey Cochrane como referentes.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "1945", title: "Segunda corona del Clásico de Otoño", description: "El equipo vence a Chicago Cubs en siete partidos y suma su segundo título de Serie Mundial.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "1968", title: "La remontada ante St. Louis", description: "Mickey Lolich gana el decisivo Juego 7 frente a Cardinals; Detroit consigue su tercer campeonato mundial.", url: "https://www.mlb.com/video/tigers-win-1968-world-series"},
      {year: "1972", title: "Primer campeonato divisional", description: "Billy Martin conduce a Detroit al título del Este de la Liga Americana, pero Oakland vence en la Serie de Campeonato.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "1984", title: "35–5 y campeones del mundo", description: "El equipo de Sparky Anderson gana 104 partidos, barre la Serie de Campeonato y supera a San Diego para levantar su cuarta corona.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "2000", title: "Inauguración de Comerica Park", description: "El 11 de abril se estrena el estadio actual de los Tigers en el centro de Detroit.", url: "https://www.mlb.com/tigers/history/ballparks"},
      {year: "2006", title: "El regreso a la Serie Mundial", description: "Con Jim Leyland como dirigente, Detroit consigue su décimo banderín de la Liga Americana; St. Louis se corona en la final.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "2012", title: "Triple Corona y otro banderín", description: "Miguel Cabrera gana la Triple Corona de bateo y los Tigers vuelven a la Serie Mundial, donde caen ante San Francisco.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "2014", title: "Cuatro títulos de división consecutivos", description: "Detroit conquista el Centro de la Liga Americana por cuarta campaña seguida, cerrando una etapa de dominio divisional.", url: "https://www.mlb.com/tigers/history/timeline"},
      {year: "2022", title: "Los 3,000 imparables de Miguel Cabrera", description: "El venezolano alcanza el histórico hito ante Colorado en Comerica Park.", url: "https://www.mlb.com/tigers/video/cabrera-reaches-3-000th-hit"},
    ],
    legends: [
      {name: "Ty Cobb", era: "1905–1926", role: "Jardinero · pionero del club", highlight: "Ganó doce títulos de bateo y fue el gran rostro de los tres banderines consecutivos entre 1907 y 1909.", url: "https://www.mlb.com/tigers/history/hall-of-famers"},
      {name: "Hank Greenberg", era: "1930–1946", role: "Primera base · campeón de 1935 y 1945", highlight: "Poderoso bateador y dos veces Jugador Más Valioso de la Liga Americana, decisivo en las primeras coronas.", url: "https://www.mlb.com/tigers/history/hall-of-famers"},
      {name: "Charlie Gehringer", era: "1924–1942", role: "Segunda base · MVP 1937", highlight: "Emblema de constancia y protagonista del campeonato de 1935; Detroit retiró su dorsal 2.", url: "https://www.mlb.com/tigers/history/retired-numbers"},
      {name: "Al Kaline", era: "1953–1974", role: "Jardinero · campeón de 1968", highlight: "Pasó toda su carrera con Detroit; fue uno de los líderes de la tercera Serie Mundial del club.", url: "https://www.mlb.com/tigers/history/retired-numbers"},
      {name: "Alan Trammell", era: "1977–1996", role: "Campocorto · MVP de Serie Mundial 1984", highlight: "Pieza central del equipo campeón y de una de las duplas de doble matanza más duraderas junto a Lou Whitaker.", url: "https://www.mlb.com/tigers/history/retired-numbers"},
      {name: "Miguel Cabrera", era: "2008–2023", role: "Primera y tercera base · Triple Corona 2012", highlight: "En Detroit ganó cuatro títulos de bateo y logró su hit 3,000; simboliza la generación que disputó la Serie Mundial de 2012.", url: "https://www.mlb.com/tigers/video/cabrera-reaches-3-000th-hit"},
    ],
    immortals: [
      {name: "Ty Cobb", year: "1936", role: "Cooperstown · jardinero", url: "https://baseballhall.org/hall-of-famers/cobb-ty"},
      {name: "Charlie Gehringer", year: "1949", role: "Cooperstown · segunda base", url: "https://baseballhall.org/hall-of-famers/gehringer-charlie"},
      {name: "Hank Greenberg", year: "1956", role: "Cooperstown · primera base", url: "https://baseballhall.org/hall-of-famers/greenberg-hank"},
      {name: "Al Kaline", year: "1980", role: "Cooperstown · jardinero", url: "https://baseballhall.org/hall-of-famers/kaline-al"},
      {name: "Jack Morris", year: "2018", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/morris-jack"},
      {name: "Alan Trammell", year: "2018", role: "Cooperstown · campocorto", url: "https://baseballhall.org/hall-of-famers/trammell-alan"},
    ],
    sources: [
      {label: "Cronología oficial de Detroit", url: "https://www.mlb.com/tigers/history/timeline"},
      {label: "Estadios históricos de los Tigers", url: "https://www.mlb.com/tigers/history/ballparks"},
      {label: "Números retirados por Detroit", url: "https://www.mlb.com/tigers/history/retired-numbers"},
      {label: "Integrantes del Salón de la Fama", url: "https://www.mlb.com/tigers/history/hall-of-famers"},
      {label: "Historia de postemporada MLB", url: "https://www.mlb.com/postseason/history"},
    ],
  },

  115: {
    intro: "Colorado Rockies debutó en Grandes Ligas en 1993 como franquicia de expansión de la Liga Nacional. En 1995 alcanzó su primera postemporada y estrenó Coors Field. Su momento cumbre llegó en 2007: la célebre racha Rocktober condujo al primer banderín de la Liga Nacional de su historia. Los Rockies aún no han ganado la Serie Mundial ni un título de división.",
    featuredStory: {
      kicker: "HISTORIA · ROCKTOBER 2007",
      title: "DE UNA RACHA INCREÍBLE A LA SERIE MUNDIAL",
      excerpt: "Colorado ganó 14 de sus últimos 15 encuentros de la temporada regular de 2007, sobrevivió al desempate de comodín ante San Diego y barrió las dos primeras series de postemporada para alcanzar el Clásico de Otoño.",
      url: ROCKIES_TIMELINE,
    },
    debutYear: "1993",
    worldSeriesTitles: 0,
    worldSeriesWinningYears: [],
    titlesVerifiedThrough: "2026",
    pennants: ["2007"],
    postseasonSource: ROCKIES_POSTSEASON,
    divisionTitles: [],
    divisionTitlesLabel: "Sin títulos divisionales hasta 2026",
    stadiumOpened: "1995",
    stadiumOpenedNote: "Coors Field abrió el 26 de abril de 1995 con una victoria 11-9 sobre New York Mets en catorce entradas. Antes, Colorado jugaba en Mile High Stadium.",
    stadiumSource: ROCKIES_BALLPARK,
    milestones: [
      {year: "1993", title: "Colorado debuta en las Grandes Ligas", description: "La franquicia de expansión inicia su camino en Mile High Stadium y despierta un gran entusiasmo de asistencia en Denver.", url: ROCKIES_TIMELINE},
      {year: "1995", title: "Un estadio y la primera postemporada", description: "Se inaugura Coors Field y los Rockies consiguen su primera clasificación a los playoffs por la vía del comodín.", url: ROCKIES_BALLPARK},
      {year: "1997", title: "Larry Walker es el Jugador Más Valioso", description: "El jardinero canadiense gana el premio MVP de la Liga Nacional tras una temporada extraordinaria.", url: ROCKIES_TIMELINE},
      {year: "2000", title: "Todd Helton firma una campaña histórica", description: "El primera base lidera la Liga Nacional en promedio de bateo e impulsadas y se consolida como ídolo del club.", url: ROCKIES_TIMELINE},
      {year: "2007", title: "Rocktober: primer banderín", description: "Colorado gana 14 de los últimos 15 juegos de temporada regular, supera el desempate por el comodín y barre a Filadelfia y Arizona para conquistar la Liga Nacional.", url: ROCKIES_TIMELINE},
      {year: "2007", title: "Primera Serie Mundial", description: "Boston Red Sox derrota a Colorado en cuatro encuentros; sigue siendo su única aparición en el Clásico de Otoño.", url: ROCKIES_POSTSEASON},
      {year: "2009", title: "Regreso a octubre", description: "Los Rockies clasifican nuevamente como comodines, aunque Philadelphia gana la Serie Divisional.", url: ROCKIES_TIMELINE},
      {year: "2010", title: "El juego sin hit de Ubaldo Jiménez", description: "El lanzador dominicano consigue el primer no-hitter en la historia de la franquicia, ante Atlanta.", url: ROCKIES_TIMELINE},
      {year: "2018", title: "Una noche de trece entradas en Chicago", description: "Colorado vence a los Cubs en el Juego del Comodín de la Liga Nacional y avanza a la Serie Divisional.", url: ROCKIES_TIMELINE},
      {year: "2020", title: "Larry Walker llega a Cooperstown", description: "Walker se convierte en el primer pelotero identificado con los Rockies en ingresar al Salón de la Fama.", url: ROCKIES_RETIRED},
      {year: "2024", title: "Todd Helton ingresa al Salón de la Fama", description: "El histórico primera base se suma a Walker como representante de la franquicia en Cooperstown.", url: ROCKIES_HELTON},
    ],
    legends: [
      {name: "Larry Walker", era: "1995–2004", role: "Jardinero · MVP 1997", highlight: "Primer representante de los Rockies elegido al Salón de la Fama; su dorsal 33 está retirado.", url: ROCKIES_RETIRED},
      {name: "Todd Helton", era: "1997–2013", role: "Primera base · campeón de bateo", highlight: "Jugó toda su trayectoria profesional en Colorado; su dorsal 17 fue retirado y entró a Cooperstown en 2024.", url: ROCKIES_HELTON},
      {name: "Dante Bichette", era: "1993–1999", role: "Jardinero · Blake Street Bombers", highlight: "Figura ofensiva de la etapa fundacional y protagonista del primer triunfo en Coors Field.", url: ROCKIES_BALLPARK},
      {name: "Andrés Galarraga", era: "1993–1997", role: "Primera base · campeón de bateo 1993", highlight: "El venezolano integró el poderoso núcleo inicial de la franquicia.", url: ROCKIES_TIMELINE},
      {name: "Troy Tulowitzki", era: "2006–2015", role: "Campocorto · líder defensivo", highlight: "Pieza fundamental del equipo que ganó la Liga Nacional en 2007.", url: ROCKIES_TIMELINE},
      {name: "Nolan Arenado", era: "2013–2020", role: "Tercera base · Guantes de Oro", highlight: "Referente de bateo y defensa de la década de 2010 en Coors Field.", url: ROCKIES_TIMELINE},
    ],
    immortals: [
      {name: "Larry Walker", year: "2020", role: "Cooperstown · jardinero", url: "https://baseballhall.org/hall-of-famers/walker-larry"},
      {name: "Todd Helton", year: "2024", role: "Cooperstown · primera base", url: "https://baseballhall.org/hall-of-famers/helton-todd"},
    ],
    sources: [
      {label: "Cronología oficial de Colorado", url: ROCKIES_TIMELINE},
      {label: "Historial de postemporada", url: ROCKIES_POSTSEASON},
      {label: "Historia de Coors Field", url: ROCKIES_BALLPARK},
      {label: "Dorsales retirados", url: ROCKIES_RETIRED},
      {label: "Todd Helton en Cooperstown", url: ROCKIES_HELTON},
    ],
  },

  114: {
    intro: "Cleveland forma parte de la Liga Americana desde su temporada inaugural de 1901. La franquicia ha competido bajo distintos nombres, incluido Indians hasta 2021; desde 2022 se llama Guardians. Conquistó dos Series Mundiales, en 1920 y 1948, y seis banderines de la Liga Americana. Progressive Field es su hogar desde 1994.",
    featuredStory: {
      kicker: "HISTORIA · DOS CORONAS MUNDIALES",
      title: "DE 1920 A 1948: LAS GRANDES CONQUISTAS DE CLEVELAND",
      excerpt: "Cleveland ganó la Serie Mundial de 1920 frente a Brooklyn y volvió a coronarse en 1948 contra Boston Braves. Más adelante disputó las Series Mundiales de 1954, 1995, 1997 y 2016.",
      url: GUARDIANS_POSTSEASON,
    },
    debutYear: "1901",
    worldSeriesTitles: 2,
    worldSeriesWinningYears: ["1920", "1948"],
    titlesVerifiedThrough: "2026",
    pennants: ["1920", "1948", "1954", "1995", "1997", "2016"],
    postseasonSource: GUARDIANS_POSTSEASON,
    divisionTitles: ["1995", "1996", "1997", "1998", "1999", "2001", "2007", "2016", "2017", "2018", "2022", "2024", "2025", "2026"],
    stadiumOpened: "1994",
    stadiumOpenedNote: "El parque abrió en 1994 con el nombre Jacobs Field y pasó a llamarse Progressive Field en 2008. Sustituyó al Cleveland Stadium como hogar del equipo.",
    stadiumSource: GUARDIANS_BALLPARK,
    milestones: [
      {year: "1901", title: "Nace una franquicia de la Liga Americana", description: "Cleveland participa como miembro fundador de la Liga Americana, antecedente directo de los actuales Guardians.", url: GUARDIANS_TIMELINE},
      {year: "1920", title: "Primer campeonato de Serie Mundial", description: "Con Tris Speaker como jugador y dirigente, Cleveland derrota a Brooklyn Robins en la Serie Mundial.", url: GUARDIANS_POSTSEASON},
      {year: "1947", title: "Larry Doby rompe una barrera histórica", description: "Doby debuta con Cleveland y se convierte en el primer jugador negro de la Liga Americana.", url: GUARDIANS_RETIRED},
      {year: "1948", title: "La segunda corona mundial", description: "Cleveland supera a Boston Braves en seis juegos bajo el mando de Lou Boudreau.", url: GUARDIANS_POSTSEASON},
      {year: "1954", title: "Un extraordinario banderín", description: "Cleveland conquista la Liga Americana y llega a la Serie Mundial, donde cae ante New York Giants.", url: GUARDIANS_POSTSEASON},
      {year: "1975", title: "Frank Robinson hace historia", description: "Robinson comienza como primer dirigente negro en la historia de las Grandes Ligas, mientras continúa como jugador.", url: GUARDIANS_TIMELINE},
      {year: "1994", title: "Un nuevo hogar en el centro", description: "Se inaugura Jacobs Field, hoy Progressive Field, como nuevo estadio de la franquicia.", url: GUARDIANS_BALLPARK},
      {year: "1995", title: "Regreso a la Serie Mundial", description: "Tras décadas sin alcanzar el Clásico de Otoño, Cleveland gana el banderín de la Americana, pero Atlanta se corona.", url: GUARDIANS_POSTSEASON},
      {year: "1997", title: "Otra final dramática", description: "Los entonces Indians pierden ante Florida Marlins en siete encuentros de Serie Mundial.", url: GUARDIANS_POSTSEASON},
      {year: "2016", title: "Una Serie Mundial de siete partidos", description: "Cleveland gana el banderín, toma ventaja de 3-1, pero Chicago Cubs remonta y obtiene el título.", url: GUARDIANS_POSTSEASON},
      {year: "2022", title: "Una nueva identidad", description: "La franquicia juega su primera temporada oficial bajo el nombre Cleveland Guardians.", url: GUARDIANS_TIMELINE},
      {year: "2026", title: "Tercer título divisional consecutivo", description: "Los Guardians ganan la Central de la Americana por tercer año seguido y llegan a la Serie de Campeonato.", url: GUARDIANS_DIVISION_2026},
    ],
    legends: [
      {name: "Tris Speaker", era: "1916–1926", role: "Jardinero · jugador y dirigente", highlight: "Capitaneó la conquista mundial de 1920 y fue uno de los grandes bateadores de su época.", url: GUARDIANS_HALL},
      {name: "Bob Feller", era: "1936–1956", role: "Lanzador · dorsal 19 retirado", highlight: "Referente histórico del pitcheo de Cleveland: 266 victorias y tres juegos sin hit ni carrera.", url: GUARDIANS_RETIRED},
      {name: "Larry Doby", era: "1947–1955 y 1958", role: "Jardinero · pionero de la Liga Americana", highlight: "Primer jugador negro de la Americana y protagonista de los campeones de 1948.", url: GUARDIANS_RETIRED},
      {name: "Lou Boudreau", era: "1938–1950", role: "Campocorto y dirigente · campeón 1948", highlight: "Ganó el premio al Jugador Más Valioso en 1948 mientras guiaba al club al campeonato.", url: GUARDIANS_HALL},
      {name: "Jim Thome", era: "1991–2002 y 2011", role: "Primera base y bateador designado", highlight: "Uno de los grandes jonroneros de la franquicia y miembro de Cooperstown.", url: GUARDIANS_RETIRED},
      {name: "José Ramírez", era: "2013–2026", role: "Tercera base · figura contemporánea", highlight: "Líder ofensivo y referente de la etapa moderna de Cleveland, incluidos los títulos divisionales recientes.", url: GUARDIANS_TIMELINE},
    ],
    immortals: [
      {name: "Tris Speaker", year: "1937", role: "Cooperstown · jardinero y dirigente", url: "https://baseballhall.org/hall-of-famers/speaker-tris"},
      {name: "Bob Feller", year: "1962", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/feller-bob"},
      {name: "Lou Boudreau", year: "1970", role: "Cooperstown · campocorto y dirigente", url: "https://baseballhall.org/hall-of-famers/boudreau-lou"},
      {name: "Bob Lemon", year: "1976", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/lemon-bob"},
      {name: "Larry Doby", year: "1998", role: "Cooperstown · jardinero", url: "https://baseballhall.org/hall-of-famers/doby-larry"},
      {name: "Jim Thome", year: "2018", role: "Cooperstown · primera base", url: "https://baseballhall.org/hall-of-famers/thome-jim"},
    ],
    sources: [
      {label: "Cronología oficial de Cleveland", url: GUARDIANS_TIMELINE},
      {label: "Resultados históricos de postemporada", url: GUARDIANS_POSTSEASON},
      {label: "Salón de la Fama del club", url: GUARDIANS_HALL},
      {label: "Dorsales retirados", url: GUARDIANS_RETIRED},
      {label: "Historia de Progressive Field", url: GUARDIANS_BALLPARK},
      {label: "Título divisional de 2026", url: GUARDIANS_DIVISION_2026},
    ],
  },

  113: {
    intro: "Cincinnati es una de las cunas del béisbol profesional. La franquicia actual compitió en la Asociación Americana desde 1882 y se incorporó a la Liga Nacional en 1890. Los Reds ganaron cinco Series Mundiales: 1919, 1940, 1975, 1976 y 1990. El legendario conjunto de los años setenta fue conocido como la Gran Máquina Roja. Desde 2003 juega en Great American Ball Park.",
    featuredStory: {
      kicker: "HISTORIA · LA GRAN MÁQUINA ROJA",
      title: "DOS TÍTULOS CONSECUTIVOS QUE MARCARON UNA ÉPOCA",
      excerpt: "Con Johnny Bench, Joe Morgan, Tony Pérez y Pete Rose como protagonistas, Cincinnati venció a Boston en una histórica Serie Mundial de siete partidos en 1975 y barrió a Yankees en 1976.",
      url: REDS_TIMELINE,
    },
    debutYear: "1882",
    worldSeriesTitles: 5,
    worldSeriesWinningYears: ["1919", "1940", "1975", "1976", "1990"],
    titlesVerifiedThrough: "2026",
    pennants: ["1882", "1919", "1939", "1940", "1961", "1970", "1972", "1975", "1976", "1990"],
    pennantLeagues: {"1882": "Asociación Americana"},
    postseasonSource: REDS_POSTSEASON,
    divisionTitles: ["1970", "1972", "1973", "1975", "1976", "1979", "1990", "1995", "2010", "2012"],
    stadiumOpened: "2003",
    stadiumOpenedNote: "Great American Ball Park abrió oficialmente el 31 de marzo de 2003 junto al río Ohio. El recinto sustituyó a Riverfront Stadium, hogar de la franquicia de 1970 a 2002.",
    stadiumSource: REDS_STADIUM,
    milestones: [
      {year: "1882", title: "Campeones en la Asociación Americana", description: "La franquicia comienza a competir en la Asociación Americana y conquista el banderín de su temporada inaugural.", url: REDS_TIMELINE},
      {year: "1890", title: "De regreso a la Liga Nacional", description: "Cincinnati inicia su etapa en la Liga Nacional tras ocho temporadas en la Asociación Americana.", url: REDS_TIMELINE},
      {year: "1919", title: "Primera Serie Mundial", description: "Los Reds derrotan a Chicago White Sox en ocho juegos en la Serie Mundial de aquel año, disputada al mejor de nueve.", url: REDS_POSTSEASON},
      {year: "1940", title: "La segunda corona", description: "Cincinnati vence a Detroit Tigers en siete encuentros y consigue su segundo campeonato mundial.", url: REDS_TIMELINE},
      {year: "1970", title: "Comienza la era de Riverfront", description: "Se inaugura Riverfront Stadium y Cincinnati conquista el banderín de la Liga Nacional.", url: REDS_TIMELINE},
      {year: "1975", title: "La Gran Máquina Roja toca la cima", description: "Cincinnati supera a Boston Red Sox en siete partidos para ganar su tercer título de Serie Mundial.", url: REDS_TIMELINE},
      {year: "1976", title: "Bicampeones invictos en octubre", description: "Los Reds barren tanto a Philadelphia Phillies en la Serie de Campeonato como a New York Yankees en la Serie Mundial.", url: REDS_TIMELINE},
      {year: "1990", title: "La sorpresa ante Oakland", description: "Dirigidos por Lou Piniella, los Reds barren a los favoritos Athletics y logran su quinto campeonato mundial.", url: REDS_1990},
      {year: "2003", title: "Abre Great American Ball Park", description: "El club estrena el estadio que ocupa desde entonces, frente al río Ohio.", url: REDS_STADIUM},
      {year: "2010", title: "Regresan los campeonatos divisionales", description: "Un jonrón de Jay Bruce permite asegurar el título de la División Central de la Nacional, el primero desde 1995.", url: "https://www.mlb.com/reds/ballpark/anniversary"},
    ],
    legends: [
      {name: "Johnny Bench", era: "1967–1983", role: "Receptor · dos veces MVP de la Nacional", highlight: "Referente de la Gran Máquina Roja y pieza esencial de los campeonatos de 1975 y 1976.", url: REDS_HALL},
      {name: "Joe Morgan", era: "1972–1979", role: "Segunda base · dos veces MVP", highlight: "Su llegada en un intercambio histórico impulsó la ofensiva y la defensa del equipo campeón.", url: REDS_TIMELINE},
      {name: "Tony Pérez", era: "1964–1976, 1984–1986", role: "Primera y tercera base · bateador de poder", highlight: "Integrante del corazón ofensivo de la Gran Máquina Roja y dos veces campeón mundial.", url: REDS_HALL},
      {name: "Pete Rose", era: "1963–1978, 1984–1986", role: "Jardinero e infielder · líder histórico de imparables", highlight: "Figura central de los campeonatos consecutivos de 1975 y 1976.", url: REDS_NUMBERS},
      {name: "Barry Larkin", era: "1986–2004", role: "Campocorto · capitán y MVP de 1995", highlight: "Cincinnatiense que pasó toda su carrera en el club y ganó la Serie Mundial de 1990.", url: REDS_HALL},
      {name: "Frank Robinson", era: "1956–1965", role: "Jardinero · MVP de 1961", highlight: "Ganó el premio al Jugador Más Valioso de la Nacional antes de su posterior etapa en Baltimore.", url: REDS_HALL},
    ],
    immortals: [
      {name: "Ernie Lombardi", year: "1986", role: "Cooperstown · receptor", url: REDS_HALL},
      {name: "Frank Robinson", year: "1982", role: "Cooperstown · jardinero", url: REDS_HALL},
      {name: "Johnny Bench", year: "1989", role: "Cooperstown · receptor", url: REDS_HALL},
      {name: "Joe Morgan", year: "1990", role: "Cooperstown · segunda base", url: REDS_HALL},
      {name: "Tony Pérez", year: "2000", role: "Cooperstown · primera base", url: REDS_HALL},
      {name: "Barry Larkin", year: "2012", role: "Cooperstown · campocorto", url: REDS_HALL},
    ],
    sources: [
      {label: "Cronología oficial de Cincinnati Reds", url: REDS_TIMELINE},
      {label: "Resultados históricos de postemporada", url: REDS_POSTSEASON},
      {label: "Integrantes del Salón de la Fama", url: REDS_HALL},
      {label: "Números retirados por el club", url: REDS_NUMBERS},
      {label: "Información de Great American Ball Park", url: REDS_STADIUM},
      {label: "Crónica del campeonato de 1990", url: REDS_1990},
    ],
  },
  145: {
    intro: "Chicago White Sox es una franquicia fundadora de la Liga Americana como circuito mayor en 1901. Conquistó las Series Mundiales de 1906 y 1917, ganó el banderín de 1959 y rompió una sequía de 88 años al barrer a Houston en la Serie Mundial de 2005. Su estadio actual, Rate Field, abrió en 1991.",
    featuredStory: {
      kicker: "HISTORIA · SERIE MUNDIAL 2005",
      title: "88 AÑOS DESPUÉS, CHICAGO VUELVE A SER CAMPEÓN",
      excerpt: "Con Ozzie Guillén como mánager, los White Sox terminaron la postemporada de 2005 con marca de 11-1 y barrieron a Houston Astros para conquistar su tercera Serie Mundial.",
      url: WHITE_SOX_2005,
    },
    debutYear: "1901",
    worldSeriesTitles: 3,
    worldSeriesWinningYears: ["1906", "1917", "2005"],
    titlesVerifiedThrough: "2026",
    pennants: ["1901", "1906", "1917", "1919", "1959", "2005"],
    postseasonSource: WHITE_SOX_TIMELINE,
    divisionTitles: ["1983", "1993", "2000", "2005", "2008", "2021"],
    stadiumOpened: "1991",
    stadiumOpenedNote: "El parque abrió el 18 de abril de 1991 como nuevo Comiskey Park, después fue U.S. Cellular Field y Guaranteed Rate Field. Hoy se conoce como Rate Field.",
    stadiumSource: WHITE_SOX_STADIUM,
    milestones: [
      {year: "1901", title: "Fundadores de la Liga Americana", description: "Los White Stockings de Chicago compiten en la primera temporada de la Liga Americana reconocida como liga mayor y ganan el banderín.", url: WHITE_SOX_TIMELINE},
      {year: "1906", title: "Campeones en el clásico de Chicago", description: "Los llamados Hitless Wonders sorprenden a sus vecinos Cubs y conquistan su primera Serie Mundial por cuatro juegos a dos.", url: "https://www.mlb.com/postseason/history/1906"},
      {year: "1917", title: "Segunda Serie Mundial", description: "Con Red Faber como figura del pitcheo, los White Sox vencen a New York Giants en seis encuentros.", url: WHITE_SOX_TIMELINE},
      {year: "1919", title: "Un banderín marcado por el escándalo", description: "Chicago llega a la Serie Mundial ante Cincinnati; el arreglo del resultado por integrantes del club desencadena el escándalo Black Sox y expulsiones de por vida.", url: WHITE_SOX_TIMELINE},
      {year: "1959", title: "Los Go-Go Sox llegan a la Serie Mundial", description: "Con Nellie Fox, Luis Aparicio y el mánager Al López, Chicago gana la Americana, aunque Dodgers se impone en el Clásico de Otoño.", url: WHITE_SOX_TIMELINE},
      {year: "1991", title: "Se estrena el nuevo Comiskey Park", description: "La franquicia inaugura el estadio que hoy recibe el nombre de Rate Field, frente al antiguo parque del South Side.", url: WHITE_SOX_STADIUM},
      {year: "2005", title: "Se rompe la sequía de 88 años", description: "El conjunto dirigido por Ozzie Guillén gana 11 de sus 12 juegos de postemporada y barre a Houston en la Serie Mundial.", url: WHITE_SOX_2005},
      {year: "2009", title: "Juego perfecto de Mark Buehrle", description: "El zurdo retira a los 27 bateadores de Tampa Bay en una de las grandes hazañas individuales de la franquicia.", url: WHITE_SOX_TIMELINE},
      {year: "2021", title: "Campeones de la División Central", description: "Chicago se corona en el Centro de la Liga Americana y regresa a octubre; su participación termina ante Houston en la Serie Divisional.", url: WHITE_SOX_TIMELINE},
    ],
    legends: [
      {name: "Luke Appling", era: "1930–1950", role: "Campocorto · ícono de la franquicia", highlight: "Disputó toda su carrera con Chicago y acumuló 2,749 imparables.", url: WHITE_SOX_HALL},
      {name: "Nellie Fox", era: "1950–1963", role: "Segunda base · MVP de 1959", highlight: "Fue pieza central de los Go-Go Sox que ganaron el banderín de la Liga Americana.", url: WHITE_SOX_HALL},
      {name: "Luis Aparicio", era: "1956–1962, 1968–1970", role: "Campocorto · defensa y velocidad", highlight: "El venezolano fue Novato del Año en 1956 y miembro del equipo campeón de la Americana en 1959.", url: WHITE_SOX_HALL},
      {name: "Minnie Miñoso", era: "1951–1957, 1960–1961 y regresos", role: "Jardinero · pionero del béisbol latino", highlight: "Una figura histórica de la afición del South Side, exaltada a Cooperstown en 2022.", url: WHITE_SOX_HALL},
      {name: "Frank Thomas", era: "1990–2005", role: "Bateador designado y primera base · dos MVP", highlight: "Conocido como The Big Hurt, fue dos veces MVP de la Americana y uno de los grandes bateadores del club.", url: WHITE_SOX_HALL},
      {name: "Paul Konerko", era: "1999–2014", role: "Primera base · capitán y campeón de 2005", highlight: "Su grand slam en el segundo juego de 2005 es uno de los momentos más recordados de esa Serie Mundial.", url: "https://www.mlb.com/whitesox/news/top-moments-in-white-sox-history"},
      {name: "Mark Buehrle", era: "2000–2011", role: "Lanzador · campeón de 2005", highlight: "Lanzó un juego sin hit en 2007 y un juego perfecto en 2009.", url: WHITE_SOX_TIMELINE},
    ],
    immortals: [
      {name: "Eddie Collins", year: "1939", role: "Cooperstown · segunda base", url: WHITE_SOX_HALL},
      {name: "Luke Appling", year: "1964", role: "Cooperstown · campocorto", url: WHITE_SOX_HALL},
      {name: "Red Faber", year: "1964", role: "Cooperstown · lanzador", url: WHITE_SOX_HALL},
      {name: "Nellie Fox", year: "1997", role: "Cooperstown · segunda base", url: WHITE_SOX_HALL},
      {name: "Luis Aparicio", year: "1984", role: "Cooperstown · campocorto", url: WHITE_SOX_HALL},
      {name: "Carlton Fisk", year: "2000", role: "Cooperstown · receptor", url: WHITE_SOX_HALL},
      {name: "Frank Thomas", year: "2014", role: "Cooperstown · primera base", url: WHITE_SOX_HALL},
      {name: "Harold Baines", year: "2019", role: "Cooperstown · bateador designado", url: WHITE_SOX_HALL},
      {name: "Minnie Miñoso", year: "2022", role: "Cooperstown · jardinero", url: WHITE_SOX_HALL},
    ],
    sources: [
      {label: "Cronología oficial de White Sox", url: WHITE_SOX_TIMELINE},
      {label: "Historia del estadio Rate Field", url: WHITE_SOX_STADIUM},
      {label: "Exaltados al Salón de la Fama", url: WHITE_SOX_HALL},
      {label: "Crónica oficial de la Serie Mundial de 2005", url: WHITE_SOX_2005},
      {label: "Números retirados por la franquicia", url: "https://www.mlb.com/whitesox/history/retired-numbers"},
    ],
  },
  112: {
    intro: "Chicago participa en la Liga Nacional desde su fundación en 1876, cuando era conocido como White Stockings. Después de conquistar las Series Mundiales de 1907 y 1908, vivió una espera de 108 años hasta su inolvidable campeonato de 2016. Desde 1916 juega en Wrigley Field, un parque inaugurado dos años antes para otro equipo.",
    featuredStory: {
      kicker: "HISTORIA · SERIE MUNDIAL 2016",
      title: "108 AÑOS DE ESPERA, SIETE JUEGOS Y UNA DÉCIMA ENTRADA",
      excerpt: "Tras remontar una desventaja de 1-3 en la serie ante Cleveland, los Cubs ganaron 8-7 el séptimo encuentro, en diez entradas. Ben Zobrist impulsó la carrera de la ventaja después de una pausa por lluvia.",
      url: "https://www.mlb.com/news/chicago-cubs-win-2016-world-series-c207938228",
    },
    debutYear: "1876",
    worldSeriesTitles: 3,
    worldSeriesWinningYears: ["1907", "1908", "2016"],
    titlesVerifiedThrough: "2026",
    pennants: ["1876", "1880", "1881", "1882", "1885", "1886", "1906", "1907", "1908", "1910", "1918", "1929", "1932", "1935", "1938", "1945", "2016"],
    pennantClubNames: {"1876": "Chicago White Stockings", "1880": "Chicago White Stockings", "1881": "Chicago White Stockings", "1882": "Chicago White Stockings", "1885": "Chicago White Stockings", "1886": "Chicago White Stockings"},
    postseasonSource: CUBS_POSTSEASON,
    divisionTitles: ["1984", "1989", "2003", "2007", "2008", "2016", "2017", "2020"],
    stadiumOpened: "1914",
    stadiumOpenedNote: "El estadio abrió el 23 de abril de 1914 como Weeghman Park, sede de los Chicago Whales de la Federal League. Los Cubs llegaron en 1916 y el nombre Wrigley Field se adoptó en 1926: 1914 es la inauguración del recinto, no el debut del club allí.",
    stadiumSource: "https://www.mlb.com/cubs/ballpark/information/history",
    milestones: [
      {year: "1876", title: "Fundadores de la Liga Nacional", description: "La franquicia comienza como Chicago White Stockings y gana el campeonato inaugural del nuevo circuito.", url: CUBS_TIMELINE},
      {year: "1906", title: "Una temporada de 116 victorias", description: "Chicago alcanza 116 triunfos y el banderín de la Nacional; pierde la Serie Mundial ante sus vecinos White Sox.", url: CUBS_TIMELINE},
      {year: "1907", title: "Primera corona de Serie Mundial", description: "Los Cubs superan a Detroit Tigers y consiguen su primer título de la Serie Mundial moderna.", url: "https://www.mlb.com/postseason/history/1907"},
      {year: "1908", title: "Bicampeonato frente a Detroit", description: "Repite la victoria sobre los Tigers y empieza una larga sequía de títulos mundiales.", url: "https://www.mlb.com/postseason/history/1908"},
      {year: "1916", title: "La llegada a Wrigley", description: "El club disputa su primer juego de la Liga Nacional en el parque construido en 1914, todavía conocido como Weeghman Park.", url: "https://www.mlb.com/cubs/ballpark/information/history"},
      {year: "1945", title: "Última Serie Mundial antes de 2016", description: "Chicago gana el banderín de la Nacional y disputa la Serie Mundial frente a Detroit, que se lleva el campeonato.", url: CUBS_TIMELINE},
      {year: "1984", title: "Regreso a octubre", description: "El equipo de Ryne Sandberg gana su división y regresa a la postemporada después de décadas de ausencia.", url: CUBS_TIMELINE},
      {year: "2003", title: "A un paso de la Serie Mundial", description: "Los Cubs llegan a la Serie de Campeonato de la Nacional, en la que caen ante Florida Marlins.", url: CUBS_TIMELINE},
      {year: "2016", title: "Se termina la espera de 108 años", description: "Chicago vence a Cleveland 8-7 en diez entradas del séptimo juego y obtiene su tercera Serie Mundial.", url: "https://www.mlb.com/news/chicago-cubs-win-2016-world-series-c207938228"},
      {year: "2020", title: "Título de la División Central", description: "En la temporada acortada, Chicago conquista el Centro de la Liga Nacional; su camino termina ante Miami en la ronda de comodines.", url: "https://www.mlb.com/cubs/news/cubs-2020-season-ends-with-loss-to-marlins"},
      {year: "2026", title: "Nueva participación en octubre", description: "Los Cubs clasifican como comodín en la Liga Nacional, pero San Diego los elimina en su primera serie de postemporada.", url: "https://www.mlb.com/cubs/news/cubs-lose-2026-nl-wild-card-series"},
    ],
    legends: [
      {name: "Mordecai ‘Three Finger’ Brown", era: "1904–1912, 1916", role: "Lanzador · campeón en 1907 y 1908", highlight: "As del montículo durante la época de las dos primeras coronas de la franquicia.", url: CUBS_HALL},
      {name: "Ernie Banks", era: "1953–1971", role: "Campocorto y primera base · ‘Mr. Cub’", highlight: "Ícono de Chicago, dos veces Jugador Más Valioso de la Nacional y autor de más de 500 jonrones.", url: "https://baseballhall.org/hall-of-famers/banks-ernie"},
      {name: "Billy Williams", era: "1959–1974", role: "Jardinero · bateador emblemático", highlight: "Una de las figuras ofensivas más constantes de la historia de los Cubs.", url: "https://baseballhall.org/hall-of-famers/williams-billy"},
      {name: "Ron Santo", era: "1960–1973", role: "Tercera base · nueve Juegos de Estrellas", highlight: "Fue parte del núcleo histórico de los años sesenta y continuó ligado al club como cronista.", url: "https://baseballhall.org/hall-of-famers/santo-ron"},
      {name: "Ferguson Jenkins", era: "1966–1973, 1982–1983", role: "Lanzador · ganador del Cy Young de 1971", highlight: "Dominó en la rotación de Chicago y se convirtió en una referencia del pitcheo de la franquicia.", url: "https://baseballhall.org/hall-of-famers/jenkins-ferguson"},
      {name: "Ryne Sandberg", era: "1982–1994, 1996–1997", role: "Segunda base · Jugador Más Valioso en 1984", highlight: "Lideró el regreso a octubre de 1984 y marcó una época en la segunda base de Wrigley Field.", url: "https://baseballhall.org/hall-of-famers/sandberg-ryne"},
      {name: "Anthony Rizzo", era: "2012–2021", role: "Primera base · campeón de 2016", highlight: "Una de las caras del equipo que puso fin a la sequía de 108 años.", url: CUBS_TIMELINE},
    ],
    immortals: [
      {name: "Mordecai Brown", year: "1949", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/brown-mordecai"},
      {name: "Ernie Banks", year: "1977", role: "Cooperstown · campocorto y primera base", url: "https://baseballhall.org/hall-of-famers/banks-ernie"},
      {name: "Billy Williams", year: "1987", role: "Cooperstown · jardinero", url: "https://baseballhall.org/hall-of-famers/williams-billy"},
      {name: "Ferguson Jenkins", year: "1991", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/jenkins-ferguson"},
      {name: "Ryne Sandberg", year: "2005", role: "Cooperstown · segunda base", url: "https://baseballhall.org/hall-of-famers/sandberg-ryne"},
      {name: "Ron Santo", year: "2012", role: "Cooperstown · tercera base", url: "https://baseballhall.org/hall-of-famers/santo-ron"},
    ],
    sources: [
      {label: "Cronología oficial de los Cubs", url: CUBS_TIMELINE},
      {label: "Archivo histórico del club", url: CUBS_HISTORY},
      {label: "Estadios de 1876 al presente", url: CUBS_BALLPARKS},
      {label: "Origen y apertura de Wrigley Field", url: "https://www.mlb.com/cubs/ballpark/information/history"},
      {label: "Jugadores de Cooperstown", url: CUBS_HALL},
      {label: "Historial oficial de postemporadas", url: CUBS_POSTSEASON},
    ],
  },
  111: {
    intro: "Fundado en 1901 como uno de los clubes originales de la Liga Americana, Boston conquistó la primera Serie Mundial moderna en 1903. Ganó cinco campeonatos antes de 1919 y, después de una espera de 86 años, volvió a coronarse en 2004; añadió otros tres títulos en 2007, 2013 y 2018. Fenway Park es su hogar desde 1912.",
    featuredStory: {
      kicker: "HISTORIA · SERIE MUNDIAL 2004",
      title: "DE LA REMONTADA IMPOSIBLE AL FIN DE 86 AÑOS DE ESPERA",
      excerpt: "Boston remontó una desventaja de tres juegos frente a los Yankees en la Serie de Campeonato de la Americana y después barrió a San Luis en la Serie Mundial de 2004.",
      url: "https://www.mlb.com/redsox/history/timeline/2000s",
    },
    debutYear: "1901",
    worldSeriesTitles: 9,
    worldSeriesWinningYears: ["1903", "1912", "1915", "1916", "1918", "2004", "2007", "2013", "2018"],
    titlesVerifiedThrough: "2026",
    pennants: ["1903", "1904", "1912", "1915", "1916", "1918", "1946", "1967", "1975", "1986", "2004", "2007", "2013", "2018"],
    pennantSources: {"1904": "https://www.mlb.com/redsox/history/timeline/1900s"},
    postseasonSource: REDSOX_POSTSEASON,
    divisionTitles: ["1975", "1986", "1988", "1990", "1995", "2007", "2013", "2016", "2017", "2018"],
    stadiumOpened: "1912",
    stadiumOpenedNote: "Fenway Park estrenó un juego de temporada regular el 20 de abril de 1912 ante los entonces New York Highlanders. Su longevidad es una parte fundamental de la identidad de Boston.",
    stadiumSource: REDSOX_FENWAY,
    milestones: [
      {year: "1901", title: "Nace el club de la Liga Americana", description: "Boston inicia su historia como una de las franquicias fundadoras del nuevo circuito americano.", url: "https://www.mlb.com/redsox/history/timeline/1900s"},
      {year: "1903", title: "Primera Serie Mundial moderna", description: "Boston derrota a Pittsburgh en ocho juegos y gana la primera edición del campeonato entre las ligas Americana y Nacional.", url: REDSOX_POSTSEASON},
      {year: "1904", title: "Un banderín sin Serie Mundial", description: "Boston vuelve a ganar la Liga Americana, pero ese año no se disputa el enfrentamiento por el campeonato entre ambas ligas.", url: "https://www.mlb.com/redsox/history/timeline/1900s"},
      {year: "1912", title: "Se inaugura Fenway Park", description: "El equipo estrena su nueva casa el 20 de abril y termina el año como campeón de la Serie Mundial.", url: REDSOX_FENWAY},
      {year: "1918", title: "Quinto campeonato de la era temprana", description: "Los Red Sox superan a Chicago Cubs y consiguen un título que sería el último de la franquicia durante 86 años.", url: REDSOX_POSTSEASON},
      {year: "1941", title: "Ted Williams batea .406", description: "Williams cierra la campaña con promedio de .406, una de las marcas más reconocidas de la historia del bateo.", url: "https://www.mlb.com/redsox/history/timeline/1940s"},
      {year: "1967", title: "El Sueño Imposible", description: "Carl Yastrzemski lidera la sorprendente carrera de Boston al banderín de la Liga Americana.", url: "https://www.mlb.com/redsox/history/timeline/1960s"},
      {year: "2004", title: "Se rompe la sequía histórica", description: "Tras remontar 0-3 a los Yankees en la Serie de Campeonato, Boston barre a San Luis y vuelve a ganar la Serie Mundial.", url: "https://www.mlb.com/redsox/history/timeline/2000s"},
      {year: "2013", title: "Campeonato en Fenway Park", description: "Boston vence a St. Louis Cardinals y celebra su octavo título de Serie Mundial.", url: REDSOX_POSTSEASON},
      {year: "2018", title: "Novena corona de la franquicia", description: "Los Red Sox superan a Los Angeles Dodgers por cuatro juegos a uno para sumar otro campeonato.", url: REDSOX_POSTSEASON},
    ],
    legends: [
      {name: "Cy Young", era: "1901–1908", role: "Lanzador · campeón de 1903", highlight: "Figura del primer campeonato de la franquicia y uno de los lanzadores emblemáticos de los comienzos de la Americana.", url: REDSOX_HOF},
      {name: "Babe Ruth", era: "1914–1919", role: "Lanzador y bateador", highlight: "Antes de su etapa con los Yankees, participó en la dinastía campeona de Boston durante la década de 1910.", url: "https://baseballhall.org/hall-of-famers/ruth-babe"},
      {name: "Ted Williams", era: "1939–1960", role: "Jardinero · promedio .406 en 1941", highlight: "Su histórica campaña de 1941 sigue siendo una referencia central de la historia ofensiva de los Red Sox.", url: "https://baseballhall.org/hall-of-famers/williams-ted"},
      {name: "Carl Yastrzemski", era: "1961–1983", role: "Jardinero · líder del Sueño Imposible", highlight: "Fue la figura central del banderín de 1967 y permaneció toda su carrera de Grandes Ligas con Boston.", url: "https://baseballhall.org/hall-of-famers/yastrzemski-carl"},
      {name: "Pedro Martínez", era: "1998–2004", role: "Lanzador · figura del título de 2004", highlight: "Su dominio desde la lomita marcó una época en Fenway Park y fue parte del equipo que rompió la sequía en 2004.", url: "https://baseballhall.org/hall-of-famers/martinez-pedro"},
      {name: "David Ortiz", era: "2003–2016", role: "Bateador designado · tres Series Mundiales", highlight: "Big Papi tuvo un papel decisivo en los campeonatos de 2004, 2007 y 2013; ingresó a Cooperstown en 2022.", url: "https://baseballhall.org/hall-of-famers/ortiz-david"},
    ],
    immortals: [
      {name: "Cy Young", year: "1937", role: "Cooperstown · lanzador de Boston", url: "https://baseballhall.org/hall-of-famers/young-cy"},
      {name: "Babe Ruth", year: "1936", role: "Cooperstown · campeón con Boston", url: "https://baseballhall.org/hall-of-famers/ruth-babe"},
      {name: "Ted Williams", year: "1966", role: "Cooperstown · bateador de Boston", url: "https://baseballhall.org/hall-of-famers/williams-ted"},
      {name: "Carl Yastrzemski", year: "1989", role: "Cooperstown · jardinero de Boston", url: "https://baseballhall.org/hall-of-famers/yastrzemski-carl"},
      {name: "Pedro Martínez", year: "2015", role: "Cooperstown · lanzador de Boston", url: "https://baseballhall.org/hall-of-famers/martinez-pedro"},
      {name: "David Ortiz", year: "2022", role: "Cooperstown · bateador designado", url: "https://baseballhall.org/hall-of-famers/ortiz-david"},
    ],
    sources: [
      {label: "Cronología del club", url: REDSOX_TIMELINE},
      {label: "Postemporada y títulos", url: REDSOX_POSTSEASON},
      {label: "Estadios históricos", url: "https://www.mlb.com/redsox/history/ballparks"},
      {label: "Fenway Park: datos oficiales", url: REDSOX_FENWAY},
      {label: "Dorsales retirados", url: REDSOX_RETIRED},
      {label: "Jugadores de Cooperstown", url: REDSOX_HOF},
    ],
  },
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
  110: {
    intro: "La franquicia comenzó en la Liga Americana en 1901 como los Milwaukee Brewers originales, se convirtió en los St. Louis Browns (1902–1953) y se mudó a Baltimore en 1954. Desde entonces los Orioles han conquistado las Series Mundiales de 1966, 1970 y 1983. El banderín de 1944 corresponde a la etapa de los Browns, no al club ya establecido en Baltimore.",
    featuredStory: {
      kicker: "HISTORIA · EL HOMBRE DE HIERRO",
      title: "CAL RIPKEN JR. Y LA RACHA DE 2,632 PARTIDOS",
      excerpt: "El 6 de septiembre de 1995, ante su afición en Camden Yards, Cal Ripken Jr. jugó su encuentro consecutivo número 2,131, superó la marca de Lou Gehrig y continuó hasta llegar a 2,632.",
      url: "https://www.mlb.com/orioles/news/cal-ripken-jr-consecutive-games-streak-celebrated-on-30th-anniversary",
    },
    debutYear: "1901",
    worldSeriesTitles: 3,
    worldSeriesWinningYears: ["1966", "1970", "1983"],
    titlesVerifiedThrough: "2026",
    pennants: ["1944", "1966", "1969", "1970", "1971", "1979", "1983"],
    pennantClubNames: { "1944": "St. Louis Browns (antecesores de Baltimore Orioles)" },
    pennantSources: { "1944": "https://www.mlb.com/postseason/history/1944" },
    postseasonSource: ORIOLES_POSTSEASON,
    divisionTitles: ["1969", "1970", "1971", "1973", "1974", "1979", "1983", "1997", "2014", "2023"],
    divisionTitlesLabel: "Títulos del Este de la Liga Americana (10; no incluye los banderines de 1944 y 1966, previos a la era divisional)",
    stadiumOpened: "1992",
    stadiumOpenedNote: "Oriole Park at Camden Yards abrió el 6 de abril de 1992 con una victoria 2-0 sobre Cleveland. Su arquitectura de estilo clásico influyó en el diseño de numerosos estadios posteriores.",
    stadiumSource: ORIOLES_BALLPARKS,
    milestones: [
      { year: "1901–1902", title: "De Milwaukee a St. Louis", description: "La franquicia juega su primer año de Liga Americana como Milwaukee Brewers y se traslada a St. Louis para convertirse en los Browns desde 1902.", url: "https://www.mlb.com/es/news/equipos-de-mlb-que-han-cambiado-de-nombre" },
      { year: "1944", title: "Único banderín de los St. Louis Browns", description: "La franquicia conquista la Liga Americana por primera vez y disputa la Serie Mundial contra los Cardinals, todavía como equipo de St. Louis.", url: "https://www.mlb.com/postseason/history/1944" },
      { year: "1954", title: "Nacen los Orioles modernos en Baltimore", description: "Tras la aprobación de la mudanza en septiembre de 1953, el club deja St. Louis y debuta con el nombre Baltimore Orioles en 1954, jugando en Memorial Stadium.", url: ORIOLES_TIMELINE },
      { year: "1966", title: "Primera Serie Mundial ganada", description: "Con Frank Robinson como Triple Corona y MVP de la Americana, Baltimore barre 4-0 a Los Angeles Dodgers y gana su primera corona.", url: "https://www.mlb.com/postseason/history/1966" },
      { year: "1969–1971", title: "Tres banderines consecutivos de la Americana", description: "El equipo domina la liga durante tres años seguidos y gana la Serie Mundial de 1970 por 4-1 contra Cincinnati, con Brooks Robinson como MVP de la serie.", url: ORIOLES_POSTSEASON },
      { year: "1983", title: "Tercer campeonato mundial", description: "Los Orioles superan a Philadelphia en cinco juegos; Eddie Murray conecta dos jonrones en el partido que asegura el título.", url: "https://www.mlb.com/orioles/video/orioles-win-1983-world-series" },
      { year: "1992", title: "Camden Yards transforma los estadios", description: "El 6 de abril abre Oriole Park at Camden Yards, que combina el entorno del centro de Baltimore con arquitectura de inspiración histórica.", url: ORIOLES_BALLPARKS },
      { year: "1995", title: "Cal Ripken Jr. supera a Lou Gehrig", description: "El 6 de septiembre disputa su encuentro consecutivo 2,131; extendería el récord hasta 2,632, cifra que permanece como marca de MLB.", url: "https://baseballhall.org/hall-of-famers/ripken-cal" },
      { year: "2014", title: "Baltimore vuelve a una Serie de Campeonato", description: "Gana la División Este y elimina a Detroit en la Serie Divisional, antes de caer ante Kansas City en la Serie de Campeonato.", url: ORIOLES_POSTSEASON },
      { year: "2023", title: "101 victorias y nuevo título del Este", description: "Con 101 triunfos en temporada regular, se corona campeón divisional y clasifica a postemporada; Texas lo elimina en la Serie Divisional.", url: ORIOLES_POSTSEASON },
    ],
    legends: [
      { name: "Cal Ripken Jr.", era: "1981–2001", role: "Campocorto y tercera base · Hombre de Hierro", highlight: "Disputó 2,632 juegos consecutivos; fue Novato del Año 1982, MVP de la Americana en 1983 y 1991 y campeón de la Serie Mundial de 1983.", url: "https://baseballhall.org/hall-of-famers/ripken-cal" },
      { name: "Brooks Robinson", era: "1955–1977", role: "Tercera base · 16 Guantes de Oro", highlight: "Apodado «la aspiradora humana», ganó el MVP de la Serie Mundial de 1970 y fue uno de los defensores más destacados de la historia.", url: ORIOLES_RETIRED },
      { name: "Frank Robinson", era: "1966–1971 como jugador", role: "Jardinero · Triple Corona 1966", highlight: "Conquistó el MVP de ambas ligas a lo largo de su carrera; fue Triple Corona, MVP de la Americana y campeón con Orioles en 1966.", url: ORIOLES_RETIRED },
      { name: "Jim Palmer", era: "1965–1967 y 1969–1984", role: "Lanzador · tres premios Cy Young", highlight: "Pasó toda su carrera en MLB con Baltimore, obtuvo 268 victorias y conquistó títulos mundiales en 1966, 1970 y 1983.", url: "https://baseballhall.org/hall-of-famers/palmer-jim" },
      { name: "Eddie Murray", era: "1977–1988 y 1996", role: "Primera base · bateador ambidiestro", highlight: "Ganó el premio Novato del Año 1977, fue protagonista del campeonato de 1983 y acumuló más de 3,000 hits y 500 jonrones en MLB.", url: ORIOLES_RETIRED },
      { name: "Earl Weaver", era: "1968–1982 y 1985–1986", role: "Mánager · leyenda de Birdland", highlight: "Dirigió a los Orioles al título de 1970, cuatro banderines de la Americana y seis campeonatos del Este durante su primera etapa.", url: ORIOLES_RETIRED },
    ],
    immortals: [
      { name: "Frank Robinson", year: "1982", role: "Cooperstown · jardinero · MVP 1966", url: "https://baseballhall.org/hall-of-famers/robinson-frank" },
      { name: "Brooks Robinson", year: "1983", role: "Cooperstown · tercera base", url: "https://baseballhall.org/hall-of-famers/robinson-brooks" },
      { name: "Jim Palmer", year: "1990", role: "Cooperstown · lanzador", url: "https://baseballhall.org/hall-of-famers/palmer-jim" },
      { name: "Earl Weaver", year: "1996", role: "Cooperstown · mánager", url: "https://baseballhall.org/hall-of-famers/weaver-earl" },
      { name: "Eddie Murray", year: "2003", role: "Cooperstown · primera base", url: "https://baseballhall.org/hall-of-famers/murray-eddie" },
      { name: "Cal Ripken Jr.", year: "2007", role: "Cooperstown · campocorto y tercera base", url: "https://baseballhall.org/hall-of-famers/ripken-cal" },
    ],
    sources: [
      { label: "Cronología oficial de Baltimore", url: ORIOLES_TIMELINE },
      { label: "Origen del nombre y mudanzas", url: "https://www.mlb.com/es/news/equipos-de-mlb-que-han-cambiado-de-nombre" },
      { label: "Resultados y títulos de postemporada", url: ORIOLES_POSTSEASON },
      { label: "Historial de la Serie Mundial de 1944", url: "https://www.mlb.com/postseason/history/1944" },
      { label: "Camden Yards y antiguos estadios", url: ORIOLES_BALLPARKS },
      { label: "Dorsales retirados y leyendas", url: ORIOLES_RETIRED },
      { label: "Jugadores del club en Cooperstown", url: ORIOLES_HOF },
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
