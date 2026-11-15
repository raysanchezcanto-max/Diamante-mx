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
