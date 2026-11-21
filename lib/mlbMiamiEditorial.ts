import type { MlbEditorialHistory } from "./mlbHistoryEditorial";

const HISTORY = "https://www.mlb.com/marlins/history";
const TIMELINE_1990 = "https://www.mlb.com/marlins/history/timeline-1990s";
const TIMELINE_2000 = "https://www.mlb.com/marlins/history/timeline-2000s";
const TIMELINE_2010 = "https://www.mlb.com/marlins/history/timeline-2010s";
const BALLPARKS = "https://www.mlb.com/marlins/history/ballparks";
const RENTERIA = "https://www.mlb.com/marlins/video/marlins-walk-off-the-1997-ws";
const BECKETT = "https://www.mlb.com/marlins/video/marlins-win-03-world-series-c5506875";

export const MIAMI_MARLINS_HISTORY: MlbEditorialHistory = {
  intro: "Los Marlins nacieron en 1993 como Florida Marlins, una franquicia de expansión de la Liga Nacional. Conquistaron la Serie Mundial en 1997 y 2003 tras clasificarse como comodines, sin ganar nunca su división. En 2012 adoptaron el nombre Miami Marlins y estrenaron un estadio con techo retráctil, hoy llamado loanDepot park. Su historia reúne a héroes de octubre como Édgar Rentería y Josh Beckett, así como a figuras modernas como Giancarlo Stanton y José Fernández.",
  featuredStory: {
    kicker: "HISTORIA · DOS CORONAS INESPERADAS",
    title: "DOS SERIES MUNDIALES, DOS HAZAÑAS DESDE EL COMODÍN",
    excerpt: "Los Marlins sorprendieron a Cleveland en once entradas del séptimo juego de 1997 gracias a Édgar Rentería. Seis años después, Josh Beckett lanzó una blanqueada en el sexto juego contra los Yankees para asegurar su segundo título.",
    url: HISTORY,
  },
  debutYear: "1993",
  worldSeriesTitles: 2,
  worldSeriesWinningYears: ["1997", "2003"],
  titlesVerifiedThrough: "2026",
  pennants: ["1997", "2003"],
  postseasonSource: HISTORY,
  divisionTitles: [],
  divisionTitlesLabel: "Sin títulos divisionales; sus campeonatos mundiales llegaron como comodines",
  stadiumOpened: "2012",
  stadiumOpenedNote: "El estadio abrió en 2012 como Marlins Park y adoptó el nombre loanDepot park en 2021. Su techo retráctil permite jugar bajo resguardo del clima de Miami; entre 1993 y 2011 el club compartió el estadio conocido, en su etapa final, como Sun Life Stadium.",
  stadiumSource: BALLPARKS,
  milestones: [
    { year: "1993", title: "Debut de los Florida Marlins", description: "La franquicia comienza a competir en la División Este de la Liga Nacional y juega sus partidos de local en el estadio de Miami Gardens.", url: TIMELINE_1990 },
    { year: "1995", title: "Jeff Conine destaca en el Juego de Estrellas", description: "Conine conecta un cuadrangular y es nombrado Jugador Más Valioso del Juego de Estrellas.", url: TIMELINE_1990 },
    { year: "1997", title: "Primera Serie Mundial en el quinto año", description: "Édgar Rentería impulsa la carrera decisiva en el undécimo episodio del Juego 7 ante Cleveland. Florida se convierte en el primer comodín campeón mundial.", url: RENTERIA },
    { year: "2003", title: "Segundo campeonato ante los Yankees", description: "Con Jack McKeon al mando, los Marlins ganan la Serie Mundial por 4-2; Josh Beckett completa la blanqueada del sexto juego en Nueva York.", url: BECKETT },
    { year: "2006", title: "Una nueva generación de talento", description: "Hanley Ramírez y Dan Uggla encabezan un joven conjunto que compite después de la reorganización de la plantilla.", url: TIMELINE_2000 },
    { year: "2012", title: "Nuevo nombre y nuevo estadio", description: "La franquicia pasa a llamarse Miami Marlins y estrena Marlins Park, hoy loanDepot park, en Little Havana.", url: TIMELINE_2010 },
    { year: "2016", title: "El legado de José Fernández", description: "La muerte del joven lanzador conmociona a la organización y a la comunidad beisbolera; su número 16 deja de utilizarse.", url: "https://www.mlb.com/marlins/news/miami-marlins-retired-numbers-c298153262" },
    { year: "2017", title: "Giancarlo Stanton conquista el MVP", description: "El jardinero conecta 59 jonrones y gana el premio al Jugador Más Valioso de la Liga Nacional.", url: "https://www.mlb.com/marlins/history" },
    { year: "2020", title: "Regreso a octubre", description: "En la temporada reducida, Miami gana su serie de comodines ante Chicago Cubs y avanza a la Serie Divisional.", url: HISTORY },
    { year: "2023", title: "Nueva clasificación a postemporada", description: "El club vuelve a los playoffs como comodín de la Nacional; Philadelphia lo elimina en la primera ronda.", url: HISTORY },
  ],
  legends: [
    { name: "Jeff Conine", era: "1993–1997 y 2003–2005", role: "Jardinero y primera base · campeón en ambas etapas", highlight: "Conocido como Mr. Marlin, fue MVP del Juego de Estrellas de 1995 y parte de las dos coronas.", url: TIMELINE_1990 },
    { name: "Édgar Rentería", era: "1996–1998", role: "Campocorto · héroe de 1997", highlight: "Con su sencillo en la undécima entrada del Juego 7 firmó el primer campeonato de los Marlins.", url: RENTERIA },
    { name: "Josh Beckett", era: "2001–2005", role: "Lanzador · MVP de Serie Mundial 2003", highlight: "Blanqueó a los Yankees en el decisivo sexto juego de 2003 y aseguró la segunda corona.", url: BECKETT },
    { name: "Miguel Cabrera", era: "2003–2007", role: "Jardinero y tercera base · campeón 2003", highlight: "Debutó en 2003, integró la ofensiva campeona y comenzó en Florida una carrera histórica.", url: TIMELINE_2000 },
    { name: "Hanley Ramírez", era: "2006–2012", role: "Campocorto · Novato del Año 2006", highlight: "Fue uno de los líderes ofensivos de Miami y ganó el título de bateo de la Nacional en 2009.", url: TIMELINE_2000 },
    { name: "Giancarlo Stanton", era: "2010–2017", role: "Jardinero · MVP de la Nacional 2017", highlight: "Conectó 59 jonrones en 2017 y consolidó una de las grandes temporadas ofensivas de la franquicia.", url: HISTORY },
    { name: "José Fernández", era: "2013–2016", role: "Lanzador · Novato del Año 2013", highlight: "Su talento y carisma dejaron una huella duradera en Miami antes de su fallecimiento en 2016.", url: "https://www.mlb.com/marlins/news/miami-marlins-retired-numbers-c298153262" },
  ],
  immortals: [
    { name: "Tony Pérez", year: "2000", role: "Cooperstown · primera base; Marlins 1993", url: "https://baseballhall.org/hall-of-famers/perez-tony" },
    { name: "Andre Dawson", year: "2010", role: "Cooperstown · jardinero; Marlins 1995–1996", url: "https://baseballhall.org/hall-of-famers/dawson-andre" },
    { name: "Iván Rodríguez", year: "2017", role: "Cooperstown · receptor; campeón con Florida en 2003", url: "https://baseballhall.org/hall-of-famers/rodriguez-ivan" },
  ],
  sources: [
    { label: "Historia oficial de los Marlins", url: HISTORY },
    { label: "Cronología fundacional (1990)", url: TIMELINE_1990 },
    { label: "Cronología de 2000", url: TIMELINE_2000 },
    { label: "Estadios y nombres históricos", url: BALLPARKS },
    { label: "Último out de 1997 — MLB", url: RENTERIA },
    { label: "Último out de 2003 — MLB", url: BECKETT },
    { label: "Números retirados y recuerdo de José Fernández", url: "https://www.mlb.com/marlins/news/miami-marlins-retired-numbers-c298153262" },
  ],
};
