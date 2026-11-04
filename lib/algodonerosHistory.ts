// Historia editorial documentada de Algodoneros del Unión Laguna.
export const ALGODONEROS_HISTORY_SOURCES = [
  {label:"Historia y Estadio Revolución · Club Unión Laguna",url:"https://www.unionlaguna.mx/estadio/"},
  {label:"Los mejores Algodoneros por temporada y posición · MiLB",url:"https://www.milb.com/news/lmb-los-mejores-algodoneros-por-temporada-y-posicion"},
  {label:"Regreso del nombre Algodoneros en 2018 · MiLB",url:"https://www.milb.com/news/regresan-los-algodoneros-union-laguna-265839964"},
  {label:"Serie del Rey 2023 · LMB",url:"https://lmb.com.mx/noticias/previa-vuelan-por-el-bicampeonato"},
] as const;
export const ALGODONEROS_HISTORY_MILESTONES = [
  {year:"1940",title:"Comienza la tradición",description:"El 30 de marzo, Unión Laguna debutó como equipo profesional de la región. En el Estadio de la Revolución venció 5–4 a Nuevo Laredo. La empresa Jabonera La Unión impulsó la llegada del club.",url:ALGODONEROS_HISTORY_SOURCES[0].url},
  {year:"1942",title:"Primer campeonato de LMB",description:"Martín Dihigo encabezó al equipo como jugador-mánager y la novena conquistó su primera corona. Dihigo destacó también desde la loma, con 211 ponches y efectividad de 2.53.",url:ALGODONEROS_HISTORY_SOURCES[0].url},
  {year:"1950",title:"La segunda estrella",description:"Dirigidos por Guillermo «Memo» Garibay, los laguneros ganaron su segundo campeonato al imponerse a los Charros de Jalisco en seis encuentros.",url:ALGODONEROS_HISTORY_SOURCES[2].url},
  {year:"2018",title:"Regresa el nombre Algodoneros",description:"Después de la etapa como Vaqueros Unión Laguna, el club retomó oficialmente el nombre tradicional Algodoneros del Unión Laguna.",url:ALGODONEROS_HISTORY_SOURCES[2].url},
  {year:"2023",title:"Otra Serie del Rey",description:"La Máquina Guinda volvió a disputar la Serie del Rey y quedó subcampeona frente a los Pericos de Puebla, que ganaron la final en seis juegos.",url:ALGODONEROS_HISTORY_SOURCES[3].url},
] as const;
export const ALGODONEROS_HISTORY_LEGENDS = [
  {initials:"MD",era:"1942",name:"Martín Dihigo",role:"Jugador-mánager",summary:"Condujo el primer campeonato; registró 211 ponches y 2.53 de efectividad en 1942.",source:ALGODONEROS_HISTORY_SOURCES[0].url},
  {initials:"GG",era:"1950",name:"Guillermo «Memo» Garibay",role:"Jugador y mánager",summary:"Parte del equipo campeón de 1942 y timonel del segundo título de LMB en 1950.",source:ALGODONEROS_HISTORY_SOURCES[0].url},
  {initials:"JD",era:"1942",name:"Jesús «Chanquilón» Díaz",role:"Jardinero",summary:"Novato del Año de la LMB en 1942, con promedio de bateo de .319 esa campaña.",source:ALGODONEROS_HISTORY_SOURCES[1].url},
  {initials:"AP",era:"1974",name:"Antonio Pollorena",role:"Lanzador abridor",summary:"Firmó marca de 25–7 y 183 ponches en 1974; lideró la liga en ambas categorías.",source:ALGODONEROS_HISTORY_SOURCES[1].url},
  {initials:"RA",era:"1993",name:"Rubén Ávila",role:"Primera base",summary:"En 1993 bateó .337 con 26 cuadrangulares y 112 carreras producidas.",source:ALGODONEROS_HISTORY_SOURCES[1].url},
  {initials:"WN",era:"2000",name:"Warren Newson",role:"Jardinero",summary:"Campeón de bateo de LMB con .386 y líder en slugging con .734 en 2000.",source:ALGODONEROS_HISTORY_SOURCES[1].url},
  {initials:"DC",era:"2009",name:"Dionys César",role:"Segunda base",summary:"Campeón de bateo y Jugador Más Valioso de LMB en 2009, con .380 de promedio.",source:ALGODONEROS_HISTORY_SOURCES[1].url},
] as const;
