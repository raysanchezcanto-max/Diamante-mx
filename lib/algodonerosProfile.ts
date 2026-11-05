
// Primera ficha extendida LMB. Publicaciones y plantilla: archivo oficial 2026.
// No confundir el archivo editorial con un feed vivo de noticias o fichajes.
export const ALGODONEROS_OFFICIAL = {
  name: "Algodoneros del Unión Laguna",
  shortName: "Algodoneros",
  nickname: "La Máquina Guinda",
  stadium: "Estadio de la Revolución",
  capacity: 7600,
  zone: "Zona Norte",
  website: "https://www.unionlaguna.mx/",
  tickets: "https://unionlaguna.boletea.com.mx/",
  lmbPage: "https://lmb.com.mx/equipos/algodoneros",
  lmbRoster: "https://lmb.com.mx/roster/algodoneros",
};

export const ALGODONEROS_STORIES = [
  {
    title: "Toros de Tijuana sentencia a Unión Laguna y accede a las Series de Zona",
    url: "https://lmb.com.mx/noticias/toros-de-tijuana-sentencia-union-laguna-y-accede-las-series-de-zona",
    label: "Postemporada 2026",
  },
  {
    title: "Unión Laguna se lleva la serie completa ante Sultanes",
    url: "https://lmb.com.mx/noticias/union-laguna-se-lleva-la-serie-completa-ante-sultanes",
    label: "Temporada 2026",
  },
  {
    title: "Toros embiste primero ante Algodoneros en el arranque de los playoffs",
    url: "https://lmb.com.mx/noticias/toros-embiste-primero-ante-algodoneros-en-el-arranque-de-los-playoffs",
    label: "Postemporada 2026",
  },
  {
    title: "Unión Laguna le gana el doble cartel a Saltillo y amarra su lugar para la postemporada",
    url: "https://lmb.com.mx/noticias/union-laguna-le-gana-el-doble-cartel-saltillo-y-amarra-su-lugar-para-la-postemporada",
    label: "Temporada 2026",
  },
  {
    title: "Pospuesto por lluvia el juego en Torreón; doble cartelera ante Saltillo",
    url: "https://lmb.com.mx/noticias/pospuesto-por-lluvia-el-juego-en-torreon-doble-cartelera-para-el-jueves-entre-saltillo-y",
    label: "Temporada 2026",
  },
  {
    title: "Unión Laguna pega primero a Saltillo y se acerca a los playoffs",
    url: "https://lmb.com.mx/noticias/union-laguna-pega-primero-saltillo-y-se-acerca-los-playoffs",
    label: "Temporada 2026",
  },
] as const;

export const ALGODONEROS_VIDEOS = [
  {
    title: "9na alta · Elevado de Nick Torres; Adrián Tovalín timbra",
    url: "https://lmb.com.mx/videos/2d30a2d3-6bf6-4384-848c-4458da478be3",
  },
  {
    title: "8va alta · Ryan Hendrix retira el tercer out por ponche",
    url: "https://lmb.com.mx/videos/b82e48df-2dad-473e-ad0b-08568c502af8",
  },
  {
    title: "6ta baja · Mason Martin produce la quinta carrera",
    url: "https://lmb.com.mx/videos/5ce86ea4-bddc-498e-87eb-201d21f5f486",
  },
  {
    title: "6ta alta · Julián Escobedo completa el out",
    url: "https://lmb.com.mx/videos/3fc5dc28-9b33-4b20-9846-c620cc593a16",
  },
] as const;

type RosterEntry = { number: number; name: string; playerId: number };
type RosterGroup = { name: string; players: RosterEntry[] };

export const ALGODONEROS_ROSTER: RosterGroup[] = [
  {
    name: "Lanzadores",
    players: [
      {number:37,name:"Aldo Montes",playerId:594105},{number:26,name:"Ángel Perdomo",playerId:622780},
      {number:40,name:"Austin Pope",playerId:687166},{number:65,name:"Brandon Brennan",playerId:592165},
      {number:31,name:"Eddy Demurias",playerId:681493},{number:8,name:"Héctor Pérez",playerId:660431},
      {number:67,name:"Jacob Barnes",playerId:606930},{number:32,name:"Luke Albright",playerId:681475},
      {number:98,name:"Lupe Chávez",playerId:660826},{number:80,name:"Matt Foster",playerId:641582},
      {number:56,name:"Miguel Vázquez",playerId:703722},{number:46,name:"Omar Araujo",playerId:807586},
      {number:55,name:"Roenis Elías",playerId:606273},{number:68,name:"Ryan Hendrix",playerId:641682},
      {number:95,name:"Thomas McIlraith",playerId:641852},{number:88,name:"Touki Toussaint",playerId:657053},
    ],
  },
  {
    name: "Receptores",
    players: [
      {number:5,name:"Dean Nevarez",playerId:681944},{number:39,name:"Francisco Arcia",playerId:516472},
      {number:64,name:"Jorge Ramírez",playerId:808525},
    ],
  },
  {
    name: "Jugadores del cuadro",
    players: [
      {number:99,name:"Adrián Tovalín",playerId:668210},{number:62,name:"Albert Lara",playerId:804107},
      {number:18,name:"Didi Gregorius",playerId:544369},{number:13,name:"Eguy Rosario",playerId:666703},
      {number:1,name:"Isan Díaz",playerId:656371},{number:31,name:"Mason Martin",playerId:676733},
    ],
  },
  {
    name: "Jardineros",
    players: [
      {number:66,name:"Edgar Robles",playerId:677977},{number:53,name:"Edward Olivares",playerId:658668},
      {number:36,name:"Je'Von Ward",playerId:669219},{number:3,name:"Julián Escobedo",playerId:686659},
      {number:10,name:"Nicholas Torres",playerId:657051},{number:54,name:"Valentín Hernández",playerId:835166},
      {number:33,name:"Yadir Drake",playerId:660436},
    ],
  },
];

// Respaldo estático SOLO del corte de temporada regular 2026 publicado por LMB.
// En la página se usa primero la respuesta compartida de getLmbStandings().
export const ALGODONEROS_NORTH_2026 = [
  {team:"Toros de Tijuana",wins:60,losses:31,pct:".659",gamesBack:"-"},
  {team:"Caliente de Durango",wins:51,losses:42,pct:".548",gamesBack:"10.0"},
  {team:"Sultanes de Monterrey",wins:49,losses:44,pct:".527",gamesBack:"12.0"},
  {team:"Charros de Jalisco",wins:48,losses:45,pct:".516",gamesBack:"13.0"},
  {team:"Acereros de Monclova",wins:48,losses:45,pct:".516",gamesBack:"13.0"},
  {team:"Algodoneros de Unión Laguna",wins:46,losses:47,pct:".495",gamesBack:"15.0"},
  {team:"Rieleros de Aguascalientes",wins:42,losses:47,pct:".472",gamesBack:"17.0"},
  {team:"Saraperos de Saltillo",wins:38,losses:55,pct:".409",gamesBack:"23.0"},
  {team:"Tecos de los Dos Laredos",wins:36,losses:57,pct:".387",gamesBack:"25.0"},
  {team:"Dorados de Chihuahua",wins:35,losses:58,pct:".376",gamesBack:"26.0"},
] as const;


// Hechos extraídos de notas oficiales de LMB. Archivo editorial 2026, no feed live.
// Las altas de academia no equivalen a altas del roster activo.
export const ALGODONEROS_MOVEMENTS = [
  {
    date: "2026-10-28",
    type: "Academia rookie",
    title: "Alta de dos prospectos",
    description: "Ramón Armando Gutiérrez Torres (P) y Luis Alberto Meza Mendoza (IF) fueron registrados en la lista de academia rookie.",
    url: "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-28-de-octubre-de-2026",
  },
  {
    date: "2026-10-19",
    type: "Academia rookie",
    title: "Alta de Jesús Antonio Hernández Villegas",
    description: "El lanzador Jesús Antonio Hernández Villegas, de Torreón, fue inscrito en la lista de academia rookie.",
    url: "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-19-de-octubre-de-2026",
  },
  {
    date: "2026-10-07",
    type: "Cesión de derechos",
    title: "Julián Escobedo pasa a Yucatán",
    description: "Algodoneros cedió definitivamente los derechos del jardinero Julián André Escobedo a Leones de Yucatán.",
    url: "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-7-de-octubre-de-2026",
    direction: "out",
    otherClub: "Leones de Yucatán",
  },
  {
    date: "2026-10-01",
    type: "Cesión de derechos",
    title: "Dos lanzadores cedidos a Leones",
    description: "Se cedieron definitivamente a Leones de Yucatán los derechos de José Marcos Torres Muro y Matthew James Foster.",
    url: "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-1-de-octubre-de-2026",
    direction: "out",
    otherClub: "Leones de Yucatán",
  },
  {
    date: "2026-09-23",
    type: "Bajas de lista",
    title: "Bajas de Gregorius y Martínez",
    description: "Mariekson Julius Gregorius y Alberth Alexander Martínez Zambrano salieron de la lista de jugadores no nacidos en México.",
    url: "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-23-de-septiembre-de-2026",
  },
] as const;
