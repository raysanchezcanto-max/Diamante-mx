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
