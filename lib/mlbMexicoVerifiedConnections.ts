import type { MexicanConnection } from "./mlbMexicanConnections";

// Puentes editoriales documentados entre las franquicias MLB y ambos circuitos
// mexicanos. Cada alta requiere prueba de participación (no solo derechos o
// anuncio), orden cronológico y una fuente primaria. No es un censo exhaustivo.
export type VerifiedMexicanConnection = {
  mlbClubId: number;
  group: "debut" | "previousExperience" | "prospect" | "toMexico";
  connection: MexicanConnection;
};

export const MLB_MEXICO_VERIFIED_CONNECTIONS: readonly VerifiedMexicanConnection[] = [
  {
    mlbClubId: 119, group: "debut",
    connection: {
      name: "Fernando Valenzuela", league: "LMP", mexicanClub: "Mayos de Navojoa",
      mexicanSlug: "mayos", direction: "mexico-to-mlb", role: "Lanzador zurdo",
      year: "Mayos 1977 · Dodgers 1980",
      description: "El Toro comenzó su carrera profesional en los Mayos de Navojoa antes de llegar a Los Ángeles; con los Dodgers desató la Fernandomanía y ganó la Serie Mundial de 1981.",
      source: "https://www.milb.com/news/gcs-45364868",
      verificationSource: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon",
    },
  },
  {
    mlbClubId: 119, group: "debut",
    connection: {
      name: "Fernando Valenzuela", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Lanzador zurdo",
      year: "Leones 1979 · Dodgers 1980",
      description: "Con Yucatán fue Novato del Año de la LMB en 1979; los Dodgers compraron su contrato y debutó en Grandes Ligas en 1980. Leones retiró su número 34 en 2013.",
      source: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon",
      verificationSource: "https://www.milb.com/news/gcs-45364868",
    },
  },
  {
    mlbClubId: 119, group: "toMexico",
    connection: {
      name: "Yasiel Puig", league: "LMB", mexicanClub: "El Águila de Veracruz",
      mexicanSlug: "el-aguila", direction: "mlb-to-mexico", role: "Jardinero",
      year: "Dodgers 2013–2018 · El Águila 2021 y 2024",
      description: "El jardinero cubano brilló con Los Ángeles entre 2013 y 2018; posteriormente jugó en Veracruz y regresó para la campaña de 2024.",
      source: "https://www.milb.com/news/el-aguila-yasiel-puig-ya-esta-en-suelo-mexicano",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "Efrén Navarro", league: "LMB", mexicanClub: "Acereros de Monclova",
      mexicanSlug: "acereros", direction: "mlb-to-mexico", role: "Primera base y jardinero",
      year: "Angels 2011, 2013–2015 · Acereros 2023",
      description: "El bateador estadounidense con raíces mexicanas jugó con los Angels y posteriormente participó con Acereros en la Liga Mexicana de Beisbol de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "Fernando Salas", league: "LMB", mexicanClub: "Olmecas de Tabasco",
      mexicanSlug: "olmecas", direction: "mlb-to-mexico", role: "Lanzador relevista",
      year: "Angels 2014–2017 · Olmecas 2023",
      description: "El relevista mexicano jugó con Anaheim durante cuatro temporadas antes de continuar su carrera, entre otros destinos, en los Olmecas de Tabasco.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "JC Ramírez", league: "LMB", mexicanClub: "Saraperos de Saltillo",
      mexicanSlug: "saraperos", direction: "mlb-to-mexico", role: "Lanzador",
      year: "Angels 2016–2019 · Saraperos 2023",
      description: "El lanzador nicaragüense pasó por los Angels en MLB y más tarde lanzó en la campaña de 2023 con Saltillo.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "JC Ramírez", league: "LMB", mexicanClub: "Sultanes de Monterrey",
      mexicanSlug: "sultanes", direction: "mlb-to-mexico", role: "Lanzador",
      year: "Angels 2016–2019 · Sultanes 2023",
      description: "La misma fuente oficial de LMB documenta también su participación con Sultanes de Monterrey durante 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "Jonathan Villar", league: "LMB", mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "Angels 2022 · Algodoneros 2023",
      description: "Tras jugar para los Angels en 2022, Villar participó en 2023 con Algodoneros del Unión Laguna.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 108, group: "toMexico",
    connection: {
      name: "Mike Morin", league: "LMB", mexicanClub: "Guerreros de Oaxaca",
      mexicanSlug: "guerreros", direction: "mlb-to-mexico", role: "Lanzador relevista",
      year: "Angels 2014–2017 · Guerreros 2023",
      description: "El relevista tuvo cuatro temporadas con los Angels y posteriormente apareció con Guerreros de Oaxaca en la LMB de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 118, group: "debut",
    connection: {
      name: "Joakim Soria", league: "LMP", mexicanClub: "Yaquis de Ciudad Obregón",
      mexicanSlug: "yaquis", direction: "mexico-to-mlb", role: "Lanzador relevista",
      year: "Yaquis 2006–2007 · MLB Kansas City 2007",
      description: "El monclovense lanzó un juego perfecto con Yaquis en diciembre de 2006, antes de debutar con los Royals en abril de 2007. Kansas City lo convirtió en uno de los cerradores más destacados de su historia.",
      source: "https://editor.lmp.mx/un-algodonero-se-retira-de-los-diamantes/amp/",
      verificationSource: "https://www.mlb.com/player/joakim-soria-465657",
    },
  },
  {
    mlbClubId: 118, group: "toMexico",
    connection: {
      name: "Alcides Escobar", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mlb-to-mexico", role: "Campocorto",
      year: "Kansas City 2011–2018 · Leones 2023",
      description: "Campocorto titular de los Royals campeones de 2015, Escobar se incorporó a los Leones de Yucatán durante la temporada de LMB de 2023.",
      source: "https://www.milb.com/news/leones-alcides-escobar-jugara-con-los-campeones",
      verificationSource: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 118, group: "toMexico",
    connection: {
      name: "Alcides Escobar", league: "LMB", mexicanClub: "Acereros de Monclova",
      mexicanSlug: "acereros", direction: "mlb-to-mexico", role: "Campocorto",
      year: "Kansas City 2011–2018 · Acereros 2023",
      description: "Después de su paso por Yucatán, Escobar también jugó con Acereros de Monclova en la campaña mexicana de 2023; la crónica oficial registra un jonrón suyo con ese club.",
      source: "https://www.milb.com/news/acereros-final-dramatico-en-victoria-yucateca",
      verificationSource: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 117, group: "debut",
    connection: {
      name: "José Luis Urquidy", league: "LMP", mexicanClub: "Venados de Mazatlán",
      mexicanSlug: "venados", direction: "mexico-to-mlb", role: "Lanzador derecho",
      year: "Venados 2015–2016 y 2018–2019 · MLB 2019",
      description: "Urquidy tuvo participación con Venados antes de su debut en Grandes Ligas con Houston en 2019; con los Astros conquistó la Serie Mundial de 2022 y regresó a lanzar en LMP en 2025.",
      source: "https://www.lmp.mx/noticias/jose-luis-urquidy-es-el-pitcher-de-la-semana",
      verificationSource: "https://editor.lmp.mx/urquidy-calienta-motores/",
    },
  },
  {
    mlbClubId: 117, group: "toMexico",
    connection: {
      name: "Chris Carter", league: "LMB", mexicanClub: "Pericos de Puebla",
      mexicanSlug: "pericos", direction: "mlb-to-mexico", role: "Primera base y bateador de poder",
      year: "Houston 2013–2015 · Pericos 2023",
      description: "Carter jugó tres campañas con Houston, luego lideró la Liga Nacional en jonrones con Milwaukee en 2016 y participó con los Pericos de Puebla en la LMB de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 117, group: "toMexico",
    connection: {
      name: "Andre Scrubb", league: "LMB", mexicanClub: "Diablos Rojos del México",
      mexicanSlug: "diablos-rojos", direction: "mlb-to-mexico", role: "Lanzador relevista",
      year: "Houston 2020–2021 · Diablos Rojos 2023",
      description: "El relevista lanzó para los Astros en 2020 y 2021; MLB registra su asignación a los Diablos Rojos del México en junio de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/andre-scrubb-668687",
    },
  },
  {
    mlbClubId: 117, group: "toMexico",
    connection: {
      name: "Henry Sosa", league: "LMB", mexicanClub: "Piratas de Campeche",
      mexicanSlug: "piratas", direction: "mlb-to-mexico", role: "Lanzador derecho",
      year: "Houston 2011 · Piratas 2023",
      description: "Sosa tuvo actividad de Grandes Ligas con Houston en 2011 y más tarde lanzó en la LMB, incluida su etapa de 2023 con los Piratas de Campeche.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.milb.com/player/henry-sosa-464400",
    },
  },
  {
    mlbClubId: 117, group: "toMexico",
    connection: {
      name: "Jonathan Villar", league: "LMB", mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", direction: "mlb-to-mexico", role: "Infielder",
      year: "Houston 2013–2015 · Unión Laguna 2023",
      description: "Villar comenzó su carrera de Grandes Ligas en Houston y apareció en la plantilla de Algodoneros del Unión Laguna durante la temporada 2023 de LMB.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },
  {
    mlbClubId: 116, group: "toMexico",
    connection: {
      name: "Fernando Rodney", league: "LMB", mexicanClub: "Diablos Rojos del México",
      mexicanSlug: "diablos-rojos", direction: "mlb-to-mexico", role: "Lanzador relevista",
      year: "Detroit 2002–2009 · Diablos Rojos 2023",
      description: "Rodney inició su carrera en Grandes Ligas con Detroit, donde lanzó en 2002–2003 y 2005–2009; en 2023 apareció en la LMB con los Diablos Rojos del México.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/fernando-rodney-407845",
    },
  },
  {
    mlbClubId: 116, group: "toMexico",
    connection: {
      name: "Renato Núñez", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mlb-to-mexico", role: "Infielder",
      year: "Detroit 2021 · Leones 2023",
      description: "El venezolano jugó con los Tigers durante 2021 y posteriormente apareció con los Leones de Yucatán en el circuito de verano mexicano de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/renato-nunez-600524",
    },
  },
  {
    mlbClubId: 116, group: "toMexico",
    connection: {
      name: "José Valdez", league: "LMB", mexicanClub: "El Águila de Veracruz",
      mexicanSlug: "el-aguila", direction: "mlb-to-mexico", role: "Lanzador derecho",
      year: "Detroit 2015 · El Águila 2023",
      description: "José Valdez debutó en Grandes Ligas con Detroit en 2015 y figura en la plantilla de El Águila de Veracruz de la temporada 2023 de LMB.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/jose-valdez-572521",
    },
  },
  {
    mlbClubId: 115, group: "toMexico",
    connection: {
      name: "Esmil Rogers", league: "LMB", mexicanClub: "El Águila de Veracruz",
      mexicanSlug: "el-aguila", direction: "mlb-to-mexico", role: "Lanzador derecho",
      year: "Colorado 2009–2012 · El Águila 2023",
      description: "Rogers debutó en Grandes Ligas con Colorado en 2009, también lanzó para Cleveland y más tarde participó en la LMB con El Águila de Veracruz durante 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/esmil-rogers-469134",
    },
  },
  {
    mlbClubId: 115, group: "toMexico",
    connection: {
      name: "Cristhian Adames", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "Colorado 2014–2017 · Leones 2023",
      description: "El dominicano debutó en MLB con Colorado en 2014, jugó para los Rockies hasta 2017 y apareció con Leones de Yucatán en la Liga Mexicana de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/cristhian-adames-542436",
    },
  },
  {
    mlbClubId: 115, group: "toMexico",
    connection: {
      name: "Rio Ruiz", league: "LMB", mexicanClub: "Diablos Rojos del México",
      mexicanSlug: "diablos-rojos", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "Colorado 2021 · Diablos 2022–2023",
      description: "Después de jugar para Colorado durante 2021, el estadounidense se incorporó a Diablos Rojos del México en 2022 y figuró entre los peloteros con experiencia MLB que disputaron la LMB de 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/rio-ruiz-547004",
    },
  },
  {
    mlbClubId: 115, group: "toMexico",
    connection: {
      name: "Rio Ruiz", league: "LMB", mexicanClub: "Conspiradores de Querétaro",
      mexicanSlug: "conspiradores", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "Colorado 2021 · Conspiradores 2024",
      description: "El jugador continuó su carrera en México y fue asignado a Conspiradores de Querétaro en abril de 2024. Se registra como un segundo vínculo con otro club de LMB, no como otro debut en MLB.",
      source: "https://www.mlb.com/player/rio-ruiz-547004",
      verificationSource: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
    },
  },

  {
    mlbClubId: 114, group: "toMexico",
    connection: {
      name: "Wilson Ramos", league: "LMB", mexicanClub: "Acereros de Monclova",
      mexicanSlug: "acereros", direction: "mlb-to-mexico", role: "Receptor",
      year: "Cleveland 2021 · Acereros 2023",
      description: "El receptor venezolano jugó con Cleveland en 2021 y participó con Acereros de Monclova en la Liga Mexicana de Beisbol de 2023. Su debut en Grandes Ligas ocurrió antes, con Minnesota en 2010.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/wilson-ramos-467092",
    },
  },
  {
    mlbClubId: 114, group: "toMexico",
    connection: {
      name: "Esmil Rogers", league: "LMB", mexicanClub: "El Águila de Veracruz",
      mexicanSlug: "el-aguila", direction: "mlb-to-mexico", role: "Lanzador derecho",
      year: "Cleveland 2012 · El Águila 2023",
      description: "Después de lanzar para Cleveland en 2012 y para otros clubes de Grandes Ligas, el dominicano formó parte de El Águila de Veracruz durante la temporada 2023 de LMB.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/esmil-rogers-469134",
    },
  },
  {
    mlbClubId: 114, group: "toMexico",
    connection: {
      name: "Óliver Pérez", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mlb-to-mexico", role: "Lanzador zurdo",
      year: "Cleveland 2018–2021 · Leones 2023",
      description: "El histórico relevista mexicano lanzó para Cleveland entre 2018 y 2021 y continuó su carrera en la Liga Mexicana con Leones de Yucatán durante 2023.",
      source: "https://www.milb.com/news/lmb-el-sello-de-la-gran-carpa",
      verificationSource: "https://www.mlb.com/player/oliver-perez-424144",
    },
  },

  {
    mlbClubId: 113, group: "toMexico",
    connection: {
      name: "Yasiel Puig", league: "LMB", mexicanClub: "El Águila de Veracruz",
      mexicanSlug: "el-aguila", direction: "mlb-to-mexico", role: "Jardinero",
      year: "Reds 2019 · El Águila 2021 y 2024",
      description: "Tras disputar la temporada de 2019 con Cincinnati y Cleveland, el jardinero cubano participó con El Águila de Veracruz en la Liga Mexicana. Su llegada a México fue posterior a su debut de MLB con Dodgers.",
      source: "https://www.milb.com/news/previa-el-glorioso-y-espectacular-regreso-a-veracruz",
      verificationSource: "https://www.milb.com/es/player/yasiel-puig-624577",
    },
  },
  {
    mlbClubId: 145, group: "previousExperience",
    connection: {
      name: "Esteban Loaiza", league: "LMP", mexicanClub: "Tomateros de Culiacán",
      mexicanSlug: "tomateros", direction: "mexico-to-mlb", role: "Lanzador derecho",
      year: "Tomateros 1995–96 · White Sox 2003–04",
      description: "El tijuanense integró a los Tomateros campeones de la Serie del Caribe de 1996 y, años después, ganó 21 juegos con los White Sox en 2003. Su debut en MLB había ocurrido antes, con Pittsburgh.",
      source: "https://www.mlb.com/es/news/gil-recuerda-la-sorpresa-que-dio-culiacan-en-1996/c-108431194",
      verificationSource: "https://www.mlb.com/es/player/esteban-loaiza-117842",
    },
  },
  {
    mlbClubId: 145, group: "toMexico",
    connection: {
      name: "Manny Bañuelos", league: "LMB", mexicanClub: "Sultanes de Monterrey",
      mexicanSlug: "sultanes", direction: "mlb-to-mexico", role: "Lanzador zurdo",
      year: "White Sox 2019 · Sultanes 2021 y 2025",
      description: "Tras lanzar en Grandes Ligas con Chicago en 2019, el zurdo mexicano jugó con Sultanes en la Liga Mexicana en 2021 y volvió a formar parte de su plantilla en 2025. Su debut de MLB fue con Atlanta en 2015.",
      source: "https://www.mlb.com/press-release/press-release-additional-yankees-roster-moves-5-26-22",
      verificationSource: "https://www.mlb.com/player/manny-banuelos-544365",
    },
  },
  {
    mlbClubId: 112, group: "debut",
    connection: {
      name: "Esteban Quiroz", league: "LMB", mexicanClub: "Tigres de Quintana Roo",
      mexicanSlug: "tigres", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "LMB 2011–2016 → Chicago 2022",
      description: "Jugó en la Liga Mexicana con Tigres antes de llegar a Grandes Ligas. Después de pasar por otras organizaciones, debutó en MLB con Chicago Cubs en septiembre de 2022.",
      source: "https://baseballsavant.mlb.com/savant-player/esteban-quiroz-606019",
      verificationSource: "https://www.mlb.com/news/esteban-quiroz-impresses-cubs-in-first-start",
    },
  },
  {
    mlbClubId: 112, group: "debut",
    connection: {
      name: "Esteban Quiroz", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "LMB 2017 → Chicago 2022",
      description: "También participó con Yucatán antes de su paso por sucursales de Boston, San Diego y Tampa Bay. Su primer equipo en Grandes Ligas fue Chicago en 2022.",
      source: "https://baseballsavant.mlb.com/savant-player/esteban-quiroz-606019",
      verificationSource: "https://www.mlb.com/news/esteban-quiroz-impresses-cubs-in-first-start",
    },
  },
  {
    mlbClubId: 112, group: "debut",
    connection: {
      name: "Manuel Rodríguez", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Lanzador derecho",
      year: "LMB 2014–2016 → Chicago 2021",
      description: "Lanzó tres campañas para Leones y fue Novato del Año de LMB en 2015. Firmó con Chicago en 2016 y se convirtió en el primer yucateco en debutar en Grandes Ligas en 2021.",
      source: "https://www.milb.com/news/lmb-conocidos-nuestros-llegan-al-entrenamiento-de-primavera",
      verificationSource: "https://www.milb.com/news/leones-melenudos-en-la-liga-invernal-mexicana",
    },
  },
  {
    mlbClubId: 111, group: "previousExperience",
    connection: {
      name: "Adrián González", league: "LMP", mexicanClub: "Venados de Mazatlán",
      mexicanSlug: "venados", direction: "mexico-to-mlb", role: "Primera base",
      year: "LMP 2005–07 · Boston 2011–12",
      description: "Jugó con Venados después de debutar en MLB con Texas, y años más tarde vistió el uniforme de Boston. No fue un debut en Grandes Ligas provocado por su etapa con Venados.",
      source: "https://www.mlb.com/es/news/adrian-gonzalez-firmo-con-mariachis-de-lmb",
      verificationSource: "https://www.mlb.com/es/player/adrian-gonzalez-408236",
    },
  },
  {
    mlbClubId: 111, group: "toMexico",
    connection: {
      name: "Luis Urías", league: "LMP", mexicanClub: "Yaquis de Obregón",
      mexicanSlug: "yaquis", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "Boston 2023 · LMP 2026–27",
      description: "Después de participar en Boston durante 2023, apareció en el encuentro inaugural de Yaquis en octubre de 2026, con un sencillo productor ante Mayos.",
      source: "https://editor.lmp.mx/con-el-pie-derecho-arranca-yaquis/",
      verificationSource: "https://www.mlb.com/es/player/luis-urias-649966",
    },
  },
  {
    mlbClubId: 111, group: "prospect",
    connection: {
      name: "Esteban Quiroz", league: "LMB", mexicanClub: "Tigres de Quintana Roo",
      mexicanSlug: "tigres", direction: "mexico-to-mlb", role: "Jugador de cuadro · sucursales de Boston",
      year: "LMB 2011–16 · MiLB Boston 2018",
      description: "Jugó con Tigres antes de ingresar al sistema de Ligas Menores de Boston en 2018. El club lo traspasó como jugador de sucursales; no debutó con Red Sox en MLB.",
      source: "https://baseballsavant.mlb.com/savant-player/esteban-quiroz-606019",
      verificationSource: "https://www.mlb.com/amp/press-release/red-sox-announce-roster-moves-300983648.html",
    },
  },
  {
    mlbClubId: 111, group: "prospect",
    connection: {
      name: "Esteban Quiroz", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Jugador de cuadro · sucursales de Boston",
      year: "LMB 2017 · MiLB Boston 2018",
      description: "Tras jugar con Yucatán en 2017 pasó por las sucursales de los Red Sox en 2018. Su debut posterior en MLB fue con Chicago Cubs, no con Boston.",
      source: "https://baseballsavant.mlb.com/savant-player/esteban-quiroz-606019",
      verificationSource: "https://www.mlb.com/amp/press-release/red-sox-announce-roster-moves-300983648.html",
    },
  },
  {
    mlbClubId: 110, group: "debut",
    connection: {
      name: "Ramón Urías", league: "LMB", mexicanClub: "Diablos Rojos del México",
      mexicanSlug: "diablos-rojos", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "2013–2017 → MLB 2020",
      description: "Disputó cinco temporadas con Diablos Rojos del México antes de su debut en Grandes Ligas con los Orioles en agosto de 2020.",
      source: "https://www.milb.com/news/lmb-conocidos-nuestros-llegan-al-entrenamiento-de-primavera",
      verificationSource: "https://www.mlb.com/es/news/los-hermanos-urias-de-magdalena-para-grandes-ligas",
    },
  },
  {
    mlbClubId: 110, group: "debut",
    connection: {
      name: "Ramón Urías", league: "LMP", mexicanClub: "Cañeros de Los Mochis",
      mexicanSlug: "caneros", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "2019–20 → MLB 2020",
      description: "Jugó 29 encuentros con Cañeros en la campaña invernal 2019-20 y ese mismo año recibió el llamado de Baltimore para estrenarse en MLB.",
      source: "https://editor.lmp.mx/ramon-urias/amp/",
      verificationSource: "https://editor.lmp.mx/ramon-urias-esta-de-regreso/",
    },
  },
  {
    mlbClubId: 110, group: "debut",
    connection: {
      name: "Manny Barreda", league: "LMB", mexicanClub: "Toros de Tijuana",
      mexicanSlug: "toros", direction: "mexico-to-mlb", role: "Lanzador",
      year: "2015–2019 → MLB 2021",
      description: "Lanzó para Toros desde 2015 y consiguió su juego sin hit ni carrera en 2017. Debutó en las Mayores con Baltimore durante 2021; regresó después al circuito mexicano.",
      source: "https://www.milb.com/news/toros-soy-la-mala-suerte-barreda",
      verificationSource: "https://www.milb.com/news/mexicobeis-manny-barreda-se-une-a-la-seleccion-mexicana-del-beisbol",
    },
  },
  {
    mlbClubId: 110, group: "debut",
    connection: {
      name: "Miguel González", league: "LMP", mexicanClub: "Venados de Mazatlán",
      mexicanSlug: "venados", direction: "mexico-to-mlb", role: "Lanzador",
      year: "2011–12 → MLB 2012",
      description: "Lanzó con Venados en el invierno de 2011 antes de firmar con Baltimore; el 29 de mayo de 2012 se estrenó en MLB con Orioles.",
      source: "https://www.mlb.com/es/news/gonzalez-de-descarte-a-abridor-en-playoffs/c-39650792",
      verificationSource: "https://www.mlb.com/es/player/miguel-gonzalez-456068",
    },
  },
  {
    mlbClubId: 110, group: "previousExperience",
    connection: {
      name: "César Valdez", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Lanzador",
      year: "2019 → MLB Baltimore 2020",
      description: "Fue Pitcher del Año de LMB con Yucatán en 2019; volvió a las Mayores con Baltimore en 2020, después de un debut MLB anterior con Arizona.",
      source: "https://www.milb.com/news/cesar-valdez-regresa-a-grandes-ligas",
      verificationSource: "https://www.mlb.com/player/cesar-valdez-491624",
    },
  },
  {
    mlbClubId: 110, group: "previousExperience",
    connection: {
      name: "Fernando Valenzuela", league: "LMB", mexicanClub: "Charros de Jalisco",
      mexicanSlug: "charros", direction: "mexico-to-mlb", role: "Lanzador zurdo",
      year: "1992 → MLB Baltimore 1993",
      description: "Tras su etapa en Grandes Ligas con Dodgers, lanzó con los Charros en la LMB de 1992 (10-9, efectividad 3.86) y regresó a MLB con Baltimore en 1993. Se trata de los Charros de verano, no de la LMP actual.",
      source: "https://www.milb.com/news/lmb-fernando-valenzuela-la-leyenda-del-hombre-del-tirabuzon",
      verificationSource: "https://www.milb.com/news/los-charros-de-jalisco-regresan-a-la-lmb",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Jonathan Schoop", league: "LMB", mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", direction: "mlb-to-mexico", role: "Segunda base",
      year: "2024",
      description: "Debutó en MLB con Orioles en 2013 y jugó para Baltimore hasta 2018. En abril de 2024 conectó sus primeros dos jonrones de LMB con Algodoneros frente a Durango.",
      source: "https://www.milb.com/news/algodoneros-ul-se-queda-con-la-serie-en-casa-ante-durango",
      verificationSource: "https://www.mlb.com/player/jonathan-schoop-570731",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Dariel Álvarez", league: "LMP", mexicanClub: "Charros de Jalisco",
      mexicanSlug: "charros", direction: "mlb-to-mexico", role: "Jardinero",
      year: "2022–23",
      description: "Después de jugar en MLB con Orioles en 2015 y 2016, participó en 33 partidos con Charros durante el invierno de 2022, antes de pasar a Yaquis.",
      source: "https://editor.lmp.mx/yaquis-inicia-segunda-vuelta-con-movimientos/",
      verificationSource: "https://www.mlb.com/player/dariel-alvarez-645848",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Dariel Álvarez", league: "LMP", mexicanClub: "Yaquis de Obregón",
      mexicanSlug: "yaquis", direction: "mlb-to-mexico", role: "Jardinero",
      year: "2020–21 y 2022–23",
      description: "Exjugador de Orioles, compitió con Yaquis como refuerzo en la postemporada 2020-21 y volvió a integrarse al equipo durante la campaña 2022-23.",
      source: "https://editor.lmp.mx/yaquis-inicia-segunda-vuelta-con-movimientos/",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Luis Ayala", league: "LMP", mexicanClub: "Yaquis de Obregón",
      mexicanSlug: "yaquis", direction: "mlb-to-mexico", role: "Relevista",
      year: "Invierno 2012–13",
      description: "Después de lanzar para Baltimore en 2012, jugó con Yaquis: consiguió un salvamento de dos entradas en blanco durante los playoffs de enero de 2013.",
      source: "https://www.mlb.com/es/news/yaquis-se-colocan-a-un-triunfo-de-semifinales/c-40882182",
      verificationSource: "https://www.mlb.com/player/luis-ayala-425646",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Dariel Álvarez", league: "LMB", mexicanClub: "Saraperos de Saltillo",
      mexicanSlug: "saraperos", direction: "mlb-to-mexico", role: "Jardinero",
      year: "2022",
      description: "Después de su paso por Baltimore, jugó en la LMB con Saltillo; el 27 de julio de 2022 conectó un cuadrangular de tres carreras para vencer a Yucatán.",
      source: "https://www.milb.com/news/saraperos-cuadrangular-de-tres-rayitas-le-da-el-triunfo-al-dragon-del-norte",
      verificationSource: "https://www.mlb.com/player/dariel-alvarez-645848",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Jonathan Villar", league: "LMB", mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "2023–2025",
      description: "Fue figura de Orioles en 2018 y 2019. Después disputó tres campañas de LMB con Algodoneros; conectó un jonrón de tres carreras ante Chihuahua en julio de 2024.",
      source: "https://lmb.com.mx/noticias/llegan-jonathan-villar-y-nestor-anguamea-caliente",
      verificationSource: "https://www.milb.com/news/algodoneros-union-laguna-gana-su-septima-serie-en-forma-consecutiva",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Jonathan Villar", league: "LMB", mexicanClub: "Caliente de Durango",
      mexicanSlug: "caliente", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "2026",
      description: "Tras sus años con Baltimore y tres temporadas en Unión Laguna, continuó su carrera mexicana con Caliente de Durango durante 2026.",
      source: "https://lmb.com.mx/jugador/542340",
      verificationSource: "https://lmb.com.mx/noticias/llegan-jonathan-villar-y-nestor-anguamea-caliente",
    },
  },
  {
    mlbClubId: 110, group: "toMexico",
    connection: {
      name: "Emmanuel Rivera", league: "LMB", mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", direction: "mlb-to-mexico", role: "Tercera base",
      year: "2026",
      description: "Jugó en MLB con Orioles durante 2024 y 2025; en la temporada 2026 registró actividad de LMB con Algodoneros antes de quedar libre en julio.",
      source: "https://lmb.com.mx/jugador/656896",
      verificationSource: "https://www.mlb.com/es/orioles/news/orioles-suman-a-vazquez-en-cambio-con-cubs-rivera-designado-para-asignacion",
    },
  },
  {
    mlbClubId: 144, group: "debut",
    connection: {
      name: "Daniel Castro", league: "LMB", mexicanClub: "Saraperos de Saltillo",
      mexicanSlug: "saraperos", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "2012–2015",
      description: "Jugó con Saltillo en 2012 y 2013 antes de debutar en Grandes Ligas con Atlanta el 17 de junio de 2015.",
      source: "https://www.mlb.com/es/player/daniel-castro-593495",
      verificationSource: "https://www.milb.com/news/gcs-131282600",
    },
  },
  {
    mlbClubId: 144, group: "debut",
    connection: {
      name: "Daniel Castro", league: "LMP", mexicanClub: "Yaquis de Obregón",
      mexicanSlug: "yaquis", direction: "mexico-to-mlb", role: "Jugador de cuadro",
      year: "2014–2015",
      description: "Participó con Yaquis en la campaña 2014-15; en diciembre de 2014 anotó tras conectar un doblete. Debutó con Atlanta en junio de 2015.",
      source: "https://www.yaquis.com.mx/2014/12/17/llega-eddie-diaz-y-yaquis-gana/",
      verificationSource: "https://www.mlb.com/es/player/daniel-castro-593495",
    },
  },
  {
    mlbClubId: 144, group: "previousExperience",
    connection: {
      name: "Josh Fuentes", league: "LMB", mexicanClub: "Leones de Yucatán",
      mexicanSlug: "leones", direction: "mexico-to-mlb", role: "Tercera base",
      year: "2022–2023",
      description: "Fue campeón con Leones en 2022 y firmó con la organización de Atlanta para el Spring Training de 2023. Su debut previo en MLB había sido con Colorado en 2019; la firma no equivale a debutar con Braves.",
      source: "https://lmb.com.mx/noticias/campeon-melenudo-firma-con-equipo-de-grandes-ligas",
      verificationSource: "https://www.mlb.com/player/joshua-fuentes-658069",
    },
  },
  {
    mlbClubId: 144, group: "prospect",
    connection: {
      name: "Anthony Vizcaya", league: "LMB", mexicanClub: "Tecos de los Dos Laredos",
      mexicanSlug: "tecos", direction: "mexico-to-mlb", role: "Lanzador",
      year: "2023–2024",
      description: "Su actuación de 2023 con Tecos derivó en un contrato de Ligas Menores con Atlanta en 2024. La fuente documenta su paso por sucursales, no un debut MLB con Braves.",
      source: "https://lmb.com.mx/noticias/previa-la-novena-binacional-en-pie-de-guerra",
      verificationSource: "https://lmb.com.mx/noticias/la-lmb-me-ha-ayudado-para-mejorar-en-cada-lanzamiento-anthony-vizcaya",
    },
  },
  {
    mlbClubId: 144, group: "toMexico",
    connection: {
      name: "Julio Teherán", league: "LMP", mexicanClub: "Charros de Jalisco",
      mexicanSlug: "charros", direction: "mlb-to-mexico", role: "Lanzador",
      year: "2024–25",
      description: "Tras nueve temporadas en MLB con Atlanta, lanzó para Charros: trabajó cinco entradas y ponchó a seis en el triunfo ante Naranjeros del 17 de octubre de 2024.",
      source: "https://cms2.charrosjalisco.com/brillan-teheran-y-ornelas-charros-gana-la-serie-a-hermosillo/",
      verificationSource: "https://www.lmp.mx/noticias/julio-teheran-es-refuerzo-de-charros",
    },
  },
  {
    mlbClubId: 144, group: "toMexico",
    connection: {
      name: "Jesús Cruz", league: "LMP", mexicanClub: "Águilas de Mexicali",
      mexicanSlug: "aguilas", direction: "mlb-to-mexico", role: "Lanzador",
      year: "2024–25",
      description: "Después de lanzar en MLB para Atlanta en 2022, registró 32 apariciones y 53 ponches con Mexicali durante la temporada 2024-25.",
      source: "https://editor.lmp.mx/jesus-cruz-estampo-su-firma-con-angels-en-mlb/amp/",
    },
  },
  {
    mlbClubId: 144, group: "toMexico",
    connection: {
      name: "Rio Ruiz", league: "LMB", mexicanClub: "Conspiradores de Querétaro",
      mexicanSlug: "conspiradores", direction: "mlb-to-mexico", role: "Jugador de cuadro",
      year: "2024",
      description: "Debutó en MLB con Atlanta en 2016 y jugó con Conspiradores de Querétaro en la LMB durante 2024. Su incorporación anunciada a Veracruz para 2027 no se cuenta como temporada disputada.",
      source: "https://lmb.com.mx/noticias/el-poder-zurdo-de-rio-ruiz-llega-el-aguila-de-veracruz",
    },
  },
  {
    mlbClubId: 144, group: "toMexico",
    connection: {
      name: "Julio Teherán", league: "LMB", mexicanClub: "Sultanes de Monterrey",
      mexicanSlug: "sultanes", direction: "mlb-to-mexico", role: "Lanzador",
      year: "2024",
      description: "Después de su trayectoria con Atlanta, lanzó para Sultanes de Monterrey en la LMB de 2024, incluida la final de la Zona Norte.",
      source: "https://www.lmp.mx/noticias/julio-teheran-es-refuerzo-de-charros",
    },
  },
  {
    mlbClubId: 144, group: "toMexico",
    connection: {
      name: "Luis Carlos Rivera", league: "LMB", mexicanClub: "Pericos de Puebla",
      mexicanSlug: "pericos", direction: "mlb-to-mexico", role: "Lanzador",
      year: "Después de 2000",
      description: "Debutó en MLB con Atlanta en abril de 2000 y continuó su carrera en México, donde jugó para Pericos de Puebla y otros clubes de LMB.",
      source: "https://lmb.com.mx/noticias/luis-carlos-rivera-toma-el-mando-para-la-temporada-2026-de-los-olmecas",
    },
  },
];
