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

const histories: Readonly<Record<number, MlbEditorialHistory>> = {
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
