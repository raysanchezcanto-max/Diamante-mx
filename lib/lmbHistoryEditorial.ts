import { LMB_HISTORY_NORTH_A } from "./lmbHistoryNorthA";
import { LMB_HISTORY_NORTH_B } from "./lmbHistoryNorthB";

// Trayectorias históricas y vínculos con inmortales documentados de clubes LMB.
// La ausencia de un perfil no permite inferir su fundación o sus leyendas.
export type HistoryMilestone={year:string;title:string;description:string;url:string};
export type HistoryLegend={name:string;role:string;highlight:string;year:string;url:string};
export type HistoryImmortal={name:string;year:number;role:string};
export type EditorialHistory={
  intro:string;
  debutYear:string;
  stadiumOpened?:string;
  stadiumSource?:string;
  milestones:readonly HistoryMilestone[];
  legends:readonly HistoryLegend[];
  immortals:readonly HistoryImmortal[];
  sources:readonly {label:string;url:string}[];
};

const source={
  olmecasOrigins:"https://www.milb.com/news/olmecas-ambiente-de-nostalgia-en-el-centenario",
  olmecas1993:"https://www.milb.com/news/gcs-59114380",
  olmecas25:"https://www.milb.com/news/gcs-292766884",
  olmecasStadium:"https://olmecastabasco.mx/desde-el-club-house/c-27-60-anos-60-personajes/",
  olmecas2026:"https://torosdetijuana.com/index.php/toros-de-tijuana-es-campeon-de-la-liga-mexicana-de-beisbol-banorte/2026/09/",
  hall:"https://www.salondelafamadelbeisbolmexicano.com/inmortales-por-orden-alfabetico",
  piratas:"https://www.milb.com/news/gcs-8024694",
  diabloOrigins:"https://www.diablos.com.mx/pdf/folleto-informativo.pdf",
  diabloPark:"https://www.diablos.com.mx/noticias/1er-aniversario-del-estadio-alfredo-harp-helu",
  diabloSandoval:"https://www.milb.com/news/diablos-rojos-jose-luis-sandoval-ingresa-al-salon-de-la-fama",
  diabloBarrera:"https://www.milb.com/news/gcs-84688498",
  leones:"https://www.leones.mx/historia/",
  leonesMilb:"https://www.milb.com/news/bcl-conoce-mas-a-los-leones-de-yucatan",
  leonesStadium:"https://www.leones.mx/los-leones-celebran-68-anos-de-historia/",
};

export const LMB_EDITORIAL_HISTORY:Record<string,EditorialHistory>={
  olmecas:{
    intro:"De Cardenales a Plataneros, Ganaderos y Olmecas: más de medio siglo de béisbol profesional en Villahermosa, con la inolvidable corona de 1993 y el regreso a la Serie del Rey en 2026.",
    debutYear:"1975",stadiumOpened:"1964",stadiumSource:source.olmecasStadium,
    milestones:[
      {year:"1975",title:"Cardenales: comienza la historia",description:"El 18 de marzo, Tabasco debutó en la LMB como Cardenales con triunfo 2–1 sobre Diablos Rojos en el Centenario.",url:source.olmecasOrigins},
      {year:"1977",title:"Regreso como Plataneros",description:"Tras un año sin equipo de LMB en 1976, la franquicia regresó bajo el nombre de Plataneros de Tabasco.",url:source.olmecasOrigins},
      {year:"1985",title:"La etapa de los Ganaderos",description:"La organización adoptó la identidad de Ganaderos de Tabasco y continuó su tradición en el Centenario.",url:source.olmecasOrigins},
      {year:"1990",title:"Nacen los Olmecas",description:"El club tomó el nombre Olmecas de Tabasco, identidad inspirada en la cultura originaria de la región.",url:source.olmecasOrigins},
      {year:"1993",title:"La primera estrella de los chocos",description:"Dirigidos por Juan Navarrete, Olmecas venció a Tecolotes de los Dos Laredos y obtuvo su primer campeonato LMB.",url:source.olmecas1993},
      {year:"2026",title:"Subcampeones de la Serie del Rey",description:"Olmecas regresó a disputar el campeonato, pero Toros de Tijuana ganó la final 4–2, cerrada el 15 de septiembre.",url:source.olmecas2026},
    ],
    legends:[
      {name:"Juan Navarrete",role:"Mánager campeón",year:"1993",highlight:"Condujo a la novena tabasqueña a su primer campeonato. Ingresó al Salón de la Fama en 1998.",url:source.olmecas1993},
      {name:"Cecilio «Chilo» Ruiz",role:"Lanzador zurdo",year:"1993",highlight:"Figura de la rotación campeona y referente del pitcheo tabasqueño. Entronizado al Salón en 2024.",url:source.olmecas25},
      {name:"Emigdio López",role:"Lanzador",year:"1993",highlight:"Integrante del cuerpo de lanzadores que conquistó la corona de LMB en 1993.",url:source.olmecas25},
      {name:"Salvador Colorado",role:"Lanzador",year:"1993",highlight:"Parte de la novena campeona. El Salón de la Fama lo reconoció en 2009.",url:source.olmecas25},
      {name:"Rusty Tillman",role:"Jardinero",year:"1993",highlight:"Participó en el conjunto campeón y en la ofensiva histórica de la temporada de 1993.",url:source.olmecas25},
      {name:"Eliseo Garzón",role:"Receptor",year:"1993",highlight:"Receptor de los Olmecas durante su memorable campeonato de 1993.",url:source.olmecas25},
      {name:"Ricardo Osuna",role:"Lanzador",year:"1993",highlight:"Pieza de la rotación que ayudó a Tabasco a lograr la corona de 1993.",url:source.olmecas25},
    ],
    immortals:[
      {name:"Juan Navarrete",year:1998,role:"Mánager del campeonato de 1993"},
      {name:"Salvador Colorado",year:2009,role:"Lanzador del plantel campeón"},
      {name:"Cecilio Ruiz",year:2024,role:"Lanzador del plantel campeón"},
    ],
    sources:[
      {label:"Orígenes de la franquicia · MiLB",url:source.olmecasOrigins},
      {label:"Campeonato de 1993 · MiLB",url:source.olmecas25},
      {label:"Estadio Centenario · Olmecas",url:source.olmecasStadium},
      {label:"Final LMB 2026 · Toros de Tijuana",url:source.olmecas2026},
      {label:"Entronizaciones oficiales",url:source.hall},
    ],
  },
  piratas:{
    intro:"Desde su llegada a la Ciudad de las Murallas en 1980, los Piratas han escrito episodios de campeonatos y grandes hazañas desde la loma de pitcheo.",
    debutYear:"1980",
    milestones:[
      {year:"1980",title:"La franquicia llega a Campeche",description:"Álvaro Lebrija trasladó la franquicia de Alacranes de Durango a Campeche, donde nacieron los Piratas.",url:source.piratas},
      {year:"1983",title:"Primera corona corsaria",description:"Los Piratas conquistaron su primer campeonato de LMB, dirigidos por Francisco «Paquín» Estrada.",url:source.piratas},
      {year:"1985",title:"Juego perfecto de Herminio Domínguez",description:"El 14 de abril, Herminio Domínguez consiguió un juego perfecto frente a Cafeteros de Córdoba.",url:source.piratas},
      {year:"1992",title:"Otro juego perfecto",description:"Don Heinkel lanzó un juego perfecto frente a Diablos Rojos del México el 2 de junio.",url:source.piratas},
      {year:"1999",title:"Dos juegos sin hit en una temporada",description:"Narciso Elvira se convirtió en el primer pitcher en la historia de LMB con dos juegos sin hit ni carrera en una temporada.",url:source.piratas},
      {year:"2004",title:"Segunda estrella de Campeche",description:"Francisco «Paquín» Estrada volvió a conducir a Piratas al campeonato de la Liga Mexicana.",url:source.piratas},
    ],
    legends:[
      {name:"Francisco «Paquín» Estrada",role:"Mánager campeón",year:"1983 · 2004",highlight:"Dirigió a Piratas a sus dos títulos de Liga Mexicana; miembro del Salón de la Fama.",url:source.piratas},
      {name:"Herminio Domínguez",role:"Lanzador",year:"1985",highlight:"Firmó tres juegos sin hit ni carrera con Piratas, uno de ellos perfecto en 1985.",url:source.piratas},
      {name:"Narciso Elvira",role:"Lanzador",year:"1999",highlight:"Primer lanzador de LMB con dos partidos sin hit ni carrera en una misma temporada.",url:source.piratas},
      {name:"Don Heinkel",role:"Lanzador",year:"1992",highlight:"Logró un juego perfecto ante Diablos Rojos del México en 1992.",url:source.piratas},
    ],
    immortals:[
      {name:"Francisco Estrada",year:2000,role:"Mánager de los campeonatos de 1983 y 2004"},
      {name:"Herminio Domínguez",year:2005,role:"Lanzador histórico de Piratas"},
    ],
    sources:[{label:"Historia de Piratas · MiLB",url:source.piratas},{label:"Salón de la Fama · Directorio",url:source.hall}],
  },
  leones:{
    intro:"De su debut en 1954 a sus cinco títulos, los Leones han construido una tradición emblemática del béisbol yucateco y del sureste mexicano.",
    debutYear:"1954",stadiumOpened:"1982",stadiumSource:source.leonesStadium,
    milestones:[
      {year:"1954",title:"Nacen los Leones de Yucatán",description:"El 17 de abril debutaron venciendo 8–0 a Tecolotes de Nuevo Laredo en el Parque Carta Clara.",url:source.leones},
      {year:"1957",title:"La primera estrella",description:"Con Óscar «Barriguilla» Rodríguez como mánager, las fieras obtuvieron su primer campeonato de LMB.",url:source.leones},
      {year:"1970",title:"Regreso al béisbol de verano",description:"El béisbol volvió a Mérida ante una multitud en el Parque Carta Clara, con Joe DiMaggio como invitado.",url:source.leones},
      {year:"1979",title:"Nuevo regreso de los melenudos",description:"Leones retomó su lugar en el circuito mexicano después de su segunda etapa fuera de la liga.",url:source.leones},
      {year:"1982",title:"Se inaugura el Kukulcán",description:"El Parque de Beisbol Kukulcán fue inaugurado el 23 de marzo como nueva casa del club.",url:source.leonesStadium},
      {year:"1984",title:"Segundo campeonato",description:"Los Leones, dirigidos por Carlos Paz, conquistaron su segunda corona al vencer a Indios de Ciudad Juárez.",url:source.leones},
      {year:"2006",title:"La tercera estrella",description:"Los melenudos ganaron otro título de LMB bajo la dirección de Lino Rivera.",url:source.leonesMilb},
      {year:"2018",title:"Campeones de Primavera",description:"Yucatán se impuso en la temporada de Primavera, con Roberto Vizcarra al mando.",url:source.leonesMilb},
      {year:"2022",title:"Quinta corona",description:"Leones logró su quinto título de LMB nuevamente bajo Roberto Vizcarra.",url:source.leonesMilb},
    ],
    legends:[
      {name:"William Berzunza",role:"Jugador histórico",year:"1957",highlight:"Fue parte del primer equipo campeón de Yucatán y miembro del Salón de la Fama.",url:source.leones},
      {name:"Juan José Pacho",role:"Figura histórica del club",year:"2009",highlight:"Leones retiró su número 1; ingresó al Salón de la Fama en 2009.",url:source.leonesMilb},
      {name:"Mercedes Esquer",role:"Figura histórica del club",year:"2011",highlight:"Su número 3 fue retirado por Leones y fue entronizado en 2011.",url:source.leonesMilb},
      {name:"Roberto Vizcarra",role:"Mánager campeón",year:"2018 · 2022",highlight:"Dirigió al club en sus títulos de Primavera 2018 y 2022.",url:source.leonesMilb},
    ],
    immortals:[
      {name:"William Berzunza",year:1995,role:"Parte del primer título de Leones"},
      {name:"Juan José Pacho",year:2009,role:"Número 1 retirado"},
      {name:"Mercedes Esquer",year:2011,role:"Número 3 retirado"},
      {name:"Cornelio García",year:2013,role:"Figura reconocida por Leones"},
    ],
    sources:[{label:"Historia oficial · Leones de Yucatán",url:source.leones},{label:"Resumen histórico · MiLB",url:source.leonesMilb},{label:"Salón de la Fama · Directorio",url:source.hall}],
  },
  "diablos-rojos":{
    intro:"Desde 1940 la Pandilla Escarlata construye una de las tradiciones más exitosas del béisbol mexicano: décadas de coronas y una nueva casa inaugurada en 2019.",
    debutYear:"1940",stadiumOpened:"2019",stadiumSource:source.diabloPark,
    milestones:[
      {year:"1940",title:"Fundación de la organización",description:"Salvador Lutteroth y Ernesto Carmona fundaron los Rojos del México el 11 de febrero.",url:source.diabloOrigins},
      {year:"1942",title:"Surge el apodo Diablos",description:"Una remontada memorable llevó al cronista Basilio «Brujo» Rosell a bautizar al conjunto con su apodo de Diablos.",url:source.diabloOrigins},
      {year:"1956",title:"Primera corona escarlata",description:"Tras 16 años de historia, el club conquistó su primer campeonato de la LMB.",url:source.diabloOrigins},
      {year:"2019",title:"Abre el Estadio Alfredo Harp Helú",description:"El 23 de marzo fue inaugurada su casa propia en la Ciudad de México.",url:source.diabloPark},
      {year:"2024",title:"Título número 17",description:"La organización conquistó su decimoséptima corona de LMB.",url:"https://www.tiendadiablos.mx/nosotros"},
      {year:"2025",title:"La decimoctava corona",description:"La Pandilla Escarlata añadió otro campeonato y alcanzó 18 títulos de LMB.",url:"https://www.tiendadiablos.mx/nosotros"},
    ],
    legends:[
      {name:"Nelson Barrera",role:"Jugador histórico",year:"15 temporadas",highlight:"Jugó 15 temporadas con Diablos y conectó 455 cuadrangulares en su carrera de LMB.",url:source.diabloBarrera},
      {name:"José Luis «Borrego» Sandoval",role:"Campocorto",year:"22 temporadas",highlight:"Jugó 22 campañas con Diablos; es líder del club en dobles con 415 y carreras impulsadas con 1,281.",url:source.diabloSandoval},
      {name:"Daniel Fernández",role:"Jugador emblemático",year:"Historia escarlata",highlight:"Uno de los jugadores homenajeados por el club como símbolos de su trayectoria.",url:"https://www.milb.com/news/diablos-rojos-copa-juntos-por-mexico"},
      {name:"Alfredo Harp Helú",role:"Directivo",year:"2019",highlight:"Impulsó la construcción de la nueva casa de Diablos y el Salón de la Fama del Beisbol Mexicano.",url:"https://www.milb.com/news/lmb-alfredo-harp-helu-y-su-amor-por-el-beisbol-lo-hacen-inmortal"},
    ],
    immortals:[
      {name:"Nelson Barrera",year:2003,role:"Jugador emblemático"},
      {name:"José Luis Sandoval",year:2020,role:"Campocorto histórico"},
      {name:"Alfredo Harp Helú",year:2023,role:"Directivo y promotor del béisbol"},
    ],
    sources:[{label:"Historia institucional · Diablos",url:source.diabloOrigins},{label:"Estadio Alfredo Harp Helú · Diablos",url:source.diabloPark},{label:"Estadísticas de Sandoval · MiLB",url:source.diabloSandoval},{label:"Salón de la Fama · Directorio",url:source.hall}],
  },
};

// Primero los perfiles históricos ya investigados; las ampliaciones cubren
// únicamente los demás clubes, sin alterar los expedientes anteriores.
const COMPLETE_LMB_HISTORY: Record<string, EditorialHistory> = {
  ...LMB_EDITORIAL_HISTORY,
  ...LMB_HISTORY_NORTH_A,
  ...LMB_HISTORY_NORTH_B,
};

export function lmbEditorialHistory(slug:string):EditorialHistory|null {
  return COMPLETE_LMB_HISTORY[slug]??null;
}
