// Casos documentados de salida desde clubes LMB hacia organizaciones MLB.
// Los debuts requieren fuentes de MLB separadas de los anuncios de firmas.
import type { LmbToMlbClub } from "./lmbToMlb";

export const LMB_TO_MLB_DOCUMENTED: Record<string, LmbToMlbClub> =
{
  "tecos": {
    "abbreviation": "LMB",
    "intro": "De los Tecolotes de los Dos Laredos a sistemas de desarrollo de organizaciones MLB. La firma confirma incorporación a una organización, no presencia en la Gran Carpa.",
    "prospects": [
      {
        "name": "Darío Gardea",
        "role": "Lanzador derecho",
        "organization": "Detroit Tigers",
        "seasonLabel": "2018",
        "note": "Tecolotes anunció que Gardea fue su primer prospecto exportado a una organización de MLB y que reportaría a su sucursal en República Dominicana.",
        "source": "https://www.milb.com/news/dario-gardea-primera-exportacion-de-laredo-264609118",
        "initials": "DG"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/dario-gardea-primera-exportacion-de-laredo-264609118"
  },
  "acereros": {
    "abbreviation": "LMB",
    "intro": "Firmas documentadas de prospectos formados en las academias de Acereros de Monclova que pasaron a organizaciones estadounidenses.",
    "prospects": [
      {
        "name": "Eiroon Flores",
        "role": "Lanzador",
        "organization": "Texas Rangers",
        "seasonLabel": "2020",
        "note": "Formado en la Academia Gerardo Benavides Luna; Monclova anunció su contratación por Texas y su incorporación al desarrollo en República Dominicana.",
        "source": "https://www.milb.com/news/el-prospecto-de-acereros-eiroon-flores-firma-con-rangers-de-texas-312616802",
        "initials": "EF"
      },
      {
        "name": "Emmanuel Sánchez Quiñones",
        "role": "Lanzador",
        "organization": "Detroit Tigers",
        "seasonLabel": "2017",
        "note": "Prospecto de Acereros del Norte y de la Academia LMB firmado por Detroit; una firma para sucursales, no debut confirmado en MLB.",
        "source": "https://www.milb.com/news/emmanuel-sanchez-firma-con-tigres-de-detroit-244918238",
        "initials": "ES"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/el-prospecto-de-acereros-eiroon-flores-firma-con-rangers-de-texas-312616802"
  },
  "charros": {
    "abbreviation": "LMB",
    "intro": "Registro de talento ligado a la franquicia de verano de Charros de Jalisco, independiente de las selecciones del club de invierno en LMP.",
    "prospects": [
      {
        "name": "José Manuel Montijo Soto",
        "role": "Lanzador derecho",
        "organization": "San Diego Padres",
        "seasonLabel": "2025",
        "note": "Registrado por Charros de Jalisco LMB en 2024, firmó contrato de Ligas Menores con San Diego en enero de 2025. MiLB confirma participación en la Dominican Summer League.",
        "source": "https://www.milb.com/player/jose-montijo-830457",
        "initials": "JM"
      }
    ],
    "debuts": [],
    "source": "https://oem.com.mx/elsoldehermosillo/deportes/de-caborca-para-la-mlb-el-pitcher-jose-manuel-montijo-firma-con-padres-de-san-diego-21352520"
  },
  "rieleros": {
    "abbreviation": "LMB",
    "intro": "Prospectos de Aguascalientes que pasaron del desarrollo de Rieleros a filiales de organizaciones MLB.",
    "prospects": [
      {
        "name": "Octavio Becerra",
        "role": "Lanzador zurdo",
        "organization": "Los Angeles Dodgers",
        "seasonLabel": "2019",
        "note": "Rieleros lo firmó en 2017 y debutó con el primer equipo en 2018; Dodgers contrató al zurdo en agosto de 2019 para continuar su formación.",
        "source": "https://www.milb.com/news/octavio-becerra-prospecto-de-rieleros-firma-con-dodgers-309626140",
        "initials": "OB"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/octavio-becerra-prospecto-de-rieleros-firma-con-dodgers-309626140"
  },
  "saraperos": {
    "abbreviation": "LMB",
    "intro": "Trayectorias de jugadores desarrollados por Saltillo que consiguieron contratos con organizaciones de MLB.",
    "prospects": [
      {
        "name": "Fabricio Macías Vargas",
        "role": "Jardinero central",
        "organization": "Pittsburgh Pirates",
        "seasonLabel": "2018",
        "note": "Después de participar con Saraperos de Saltillo en 2017, firmó con Pittsburgh en febrero de 2018 para competir en su sistema de desarrollo.",
        "source": "https://www.milb.com/news/el-saltillense-fabricio-macias-firma-con-pittsburgh-267102096",
        "initials": "FM"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/el-saltillense-fabricio-macias-firma-con-pittsburgh-267102096"
  },
  "sultanes": {
    "abbreviation": "LMB",
    "intro": "Sultanes desarrolló y presentó jugadores que firmaron con franquicias estadounidenses. Jesús Cruz es un caso donde podemos comprobar las dos etapas: contrato y debut oficial.",
    "prospects": [
      {
        "name": "Jesús Cruz Sustaita",
        "role": "Lanzador derecho",
        "organization": "St. Louis Cardinals",
        "seasonLabel": "2017",
        "note": "Debutó en LMB con Monterrey en 2017 y ese julio fue adquirido por los Cardinals; más tarde jugó efectivamente en Grandes Ligas.",
        "source": "https://www.milb.com/news/jesus-cruz-firma-con-cardenales-240990002",
        "initials": "JC"
      }
    ],
    "debuts": [
      {
        "title": "Jesús Cruz",
        "description": "Tras su paso por Sultanes y firma con St. Louis en 2017, debutó en MLB con los Cardinals el 18 de agosto de 2020 ante Chicago Cubs.",
        "mlbClub": "St. Louis Cardinals",
        "debutDate": "18/08/2020",
        "source": "https://www.mlb.com/player/jesus-cruz-672911"
      }
    ],
    "source": "https://www.milb.com/news/jesus-cruz-firma-con-cardenales-240990002"
  },
  "toros": {
    "abbreviation": "LMB",
    "intro": "La academia de Tijuana ha documentado numerosas firmas con organizaciones de MLB. Alejandro Kirk llegó hasta el primer equipo de Toronto; otros casos son contratos de desarrollo.",
    "prospects": [
      {
        "name": "Alejandro Kirk",
        "role": "Receptor",
        "organization": "Toronto Blue Jays",
        "seasonLabel": "2016",
        "note": "Toros de Tijuana anunció su firma con Toronto tras ser observado en un showcase del club. Posteriormente tuvo debut comprobado en MLB.",
        "source": "https://www.milb.com/news/gcs-203310024",
        "initials": "AK"
      },
      {
        "name": "Fernando Díaz",
        "role": "Receptor",
        "organization": "St. Louis Cardinals",
        "seasonLabel": "2019",
        "note": "El prospecto ensenadense pasó de la academia de Toros a los Cardinals, con primera asignación prevista en la liga de novatos de República Dominicana.",
        "source": "https://www.milb.com/news/gcs-305884350",
        "initials": "FD"
      },
      {
        "name": "Alemain Raúl Cruz",
        "role": "Lanzador derecho",
        "organization": "Detroit Tigers",
        "seasonLabel": "2024",
        "note": "Firmó con Detroit en diciembre de 2024; Toros indicó que continuaría su desarrollo en la Dominican Summer League de 2025.",
        "source": "https://www.milb.com/news/toros-tigres-de-detroit-firma-a-prospecto-de-tijuana",
        "initials": "AR"
      }
    ],
    "debuts": [
      {
        "title": "Alejandro Kirk",
        "description": "Formado en Toros de Tijuana y contratado por Toronto en 2016, debutó el 12 de septiembre de 2020 con Blue Jays contra New York Mets.",
        "mlbClub": "Toronto Blue Jays",
        "debutDate": "12/09/2020",
        "source": "https://www.mlb.com/player/alejandro-kirk-672386"
      }
    ],
    "source": "https://www.milb.com/news/gcs-203310024"
  },
  "diablos-rojos": {
    "abbreviation": "LMB",
    "intro": "La Academia Alfredo Harp Helú ha desarrollado prospectos que firmaron con organizaciones de MLB. Una firma de sucursales no acredita un debut en el equipo mayor.",
    "prospects": [
      {
        "name": "Máximo Rodríguez",
        "role": "Prospecto",
        "organization": "Seattle Mariners",
        "seasonLabel": "2025",
        "note": "Diablos anunció en enero de 2025 su firma internacional con Seattle para comenzar en el sistema de Ligas Menores.",
        "source": "https://www.milb.com/news/diablos-rojos-maximo-rodriguez-y-roberto-salas-son-firmados-por-equipos-de-mlb",
        "initials": "MR"
      },
      {
        "name": "Roberto Salas",
        "role": "Lanzador",
        "organization": "Colorado Rockies",
        "seasonLabel": "2025",
        "note": "Formado en la academia de Diablos y con aparición en LMB en 2024; firmó con Colorado en enero de 2025.",
        "source": "https://www.milb.com/news/diablos-rojos-maximo-rodriguez-y-roberto-salas-son-firmados-por-equipos-de-mlb",
        "initials": "RS"
      },
      {
        "name": "Humberto Cruz",
        "role": "Lanzador",
        "organization": "San Diego Padres",
        "seasonLabel": "2024",
        "note": "Producto de la cantera escarlata, firmó con Padres después de debutar con Diablos en la LMB en 2023.",
        "source": "https://www.milb.com/news/diablos-rojos-humberto-cruz-firma-con-los-padres-de-san-diego",
        "initials": "HC"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/diablos-rojos-maximo-rodriguez-y-roberto-salas-son-firmados-por-equipos-de-mlb"
  },
  "el-aguila": {
    "abbreviation": "LMB",
    "intro": "El sistema de El Águila de Veracruz documentó prospectos incorporados a organizaciones de las Grandes Ligas, sin que ello implique haber alcanzado la máxima categoría.",
    "prospects": [
      {
        "name": "Ulises Villa",
        "role": "Jugador de cuadro",
        "organization": "Texas Rangers",
        "seasonLabel": "2015",
        "note": "La directiva de los Rojos del Águila comunicó la negociación del infielder con Rangers tras el seguimiento de buscadores de talento.",
        "source": "https://www.milb.com/news/gcs-159458572",
        "initials": "UV"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/gcs-159458572"
  },
  "guerreros": {
    "abbreviation": "LMB",
    "intro": "Desde la Academia Alfredo Harp Helú y el sistema de Guerreros de Oaxaca han surgido prospectos que firmaron con clubes de MLB.",
    "prospects": [
      {
        "name": "Édgar Avilés",
        "role": "Lanzador derecho",
        "organization": "Los Angeles Dodgers",
        "seasonLabel": "2022",
        "note": "Guerreros informó su firma con Dodgers después de competir en la Liga Invernal Mexicana y desarrollarse en la academia vinculada al club.",
        "source": "https://www.milb.com/news/guerreros-edgar-aviles-firma-con-los-dodgers",
        "initials": "ÉA"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/guerreros-edgar-aviles-firma-con-los-dodgers"
  },
  "leones": {
    "abbreviation": "LMB",
    "intro": "Desde la Academia del Pacífico y el primer equipo de Leones de Yucatán salieron jugadores que firmaron con organizaciones MLB. Manuel Rodríguez completó además el salto a la Gran Carpa.",
    "prospects": [
      {
        "name": "Manuel Rodríguez",
        "role": "Lanzador derecho",
        "organization": "Chicago Cubs",
        "seasonLabel": "2016",
        "note": "Jugó tres temporadas para Leones de Yucatán antes de firmar con Chicago en 2016; alcanzó MLB cinco años después.",
        "source": "https://www.mlb.com/player/manuel-rodriguez-655889",
        "initials": "MR"
      },
      {
        "name": "Anhuar García",
        "role": "Lanzador",
        "organization": "Chicago Cubs",
        "seasonLabel": "2024",
        "note": "Lanzador formado en la Academia del Pacífico y que también participó con Leones en LMB; firmó con los Cubs en diciembre de 2024.",
        "source": "https://www.milb.com/news/leones-los-cachorros-de-chicago-firman-a-anhuar-garcia",
        "initials": "AG"
      },
      {
        "name": "Ángel Paul Zazueta García",
        "role": "Lanzador",
        "organization": "Cincinnati Reds",
        "seasonLabel": "2023",
        "note": "El prospecto de Leones y la Academia del Pacífico firmó con Cincinnati para continuar su desarrollo en el béisbol profesional.",
        "source": "https://www.milb.com/news/leones-pitcher-melenudo-firma-con-los-rojos-de-cincinnati",
        "initials": "ÁP"
      },
      {
        "name": "Christian Muñiz",
        "role": "Lanzador",
        "organization": "Los Angeles Dodgers",
        "seasonLabel": "2024",
        "note": "Leones anunció en enero su firma con Dodgers tras su trabajo en la Academia del Pacífico.",
        "source": "https://www.milb.com/news/leones-talento-melenudo-a-grandes-ligas",
        "initials": "CM"
      }
    ],
    "debuts": [
      {
        "title": "Manuel Rodríguez",
        "description": "Tras tres campañas con Leones de Yucatán y firma con Chicago en 2016, debutó con los Cubs el 30 de julio de 2021.",
        "mlbClub": "Chicago Cubs",
        "debutDate": "30/07/2021",
        "source": "https://www.mlb.com/player/manuel-rodriguez-655889"
      }
    ],
    "source": "https://www.mlb.com/player/manuel-rodriguez-655889"
  },
  "pericos": {
    "abbreviation": "LMB",
    "intro": "La cantera de Pericos de Puebla registra firmas de peloteros de su academia con organizaciones MLB.",
    "prospects": [
      {
        "name": "Santiago Gómez",
        "role": "Jugador de cuadro",
        "organization": "New York Yankees",
        "seasonLabel": "2022",
        "note": "Pericos y el scout de Yankees anunciaron la firma del infielder surgido de la Academia poblana.",
        "source": "https://www.milb.com/news/pericos-santiago-gomez-firma-con-los-yankees",
        "initials": "SG"
      },
      {
        "name": "Carlos Hampshire",
        "role": "Lanzador derecho",
        "organization": "New York Yankees",
        "seasonLabel": "2023",
        "note": "Prospecto de la primera generación de la Academia de Pericos; firmó con Yankees en enero de 2023.",
        "source": "https://www.milb.com/news/pericos-otro-emplumado-que-vuela-a-la-mlb",
        "initials": "CH"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/pericos-santiago-gomez-firma-con-los-yankees"
  },
  "piratas": {
    "abbreviation": "LMB",
    "intro": "Piratas de Campeche documenta la transferencia de jugadores de su primer equipo a organizaciones MLB para continuar su carrera en Estados Unidos.",
    "prospects": [
      {
        "name": "Irvin Machuca",
        "role": "Lanzador",
        "organization": "Cincinnati Reds",
        "seasonLabel": "2025",
        "note": "Después de cuatro temporadas con Piratas, el pitcher firmó con los Reds en enero de 2025; no se afirma que debutó en MLB.",
        "source": "https://www.milb.com/news/piratas-irvin-machuca-parte-rumbo-a-cincinnati",
        "initials": "IM"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/piratas-irvin-machuca-parte-rumbo-a-cincinnati"
  },
  "tigres": {
    "abbreviation": "LMB",
    "intro": "Tigres de Quintana Roo desarrolló prospectos que firmaron con organizaciones MLB. Además, Esteban Quiroz, quien jugó varias temporadas con los felinos antes de seguir su carrera en LMB, sí debutó en las Mayores.",
    "prospects": [
      {
        "name": "Miguel Anselmo Gamboa Flores",
        "role": "Jugador de cuadro",
        "organization": "Seattle Mariners",
        "seasonLabel": "2016",
        "note": "Firmado inicialmente por Tigres en 2014, pasó a los Mariners en febrero de 2016 para su formación en República Dominicana.",
        "source": "https://www.milb.com/news/gcs-163755482",
        "initials": "MA"
      },
      {
        "name": "Esteban Quiroz",
        "role": "Jugador de cuadro",
        "organization": "Boston Red Sox",
        "seasonLabel": "2017",
        "note": "Jugó con Tigres de Quintana Roo de 2011 a 2016 y posteriormente con Leones de Yucatán en 2017; Boston lo firmó para Ligas Menores al final de ese año.",
        "source": "https://www.mlb.com/player/esteban-quiroz-606019",
        "initials": "EQ"
      }
    ],
    "debuts": [
      {
        "title": "Esteban Quiroz",
        "description": "Después de su etapa en Tigres (2011–2016), otra campaña de LMB con Leones y varios años en sucursales, debutó en MLB con Chicago Cubs el 17 de septiembre de 2022.",
        "mlbClub": "Chicago Cubs",
        "debutDate": "17/09/2022",
        "source": "https://www.mlb.com/player/esteban-quiroz-606019"
      }
    ],
    "source": "https://www.milb.com/news/gcs-163755482"
  },
  "bravos": {
    "abbreviation": "LMB",
    "intro": "La academia Bravos–CODE ha gestionado firmas internacionales de jóvenes talentos vinculados a León.",
    "prospects": [
      {
        "name": "Bryan Lara",
        "role": "Lanzador",
        "organization": "Los Angeles Dodgers",
        "seasonLabel": "2024",
        "note": "Bravos de León y su academia con CODE Guanajuato anunciaron la incorporación del joven salmantino al sistema de Dodgers en septiembre de 2024.",
        "source": "https://www.milb.com/news/bravos-bryan-lara-es-historica-firma-de-la-academia-bravos-code-para-dodgers",
        "initials": "BL"
      }
    ],
    "debuts": [],
    "source": "https://www.milb.com/news/bravos-bryan-lara-es-historica-firma-de-la-academia-bravos-code-para-dodgers"
  }
};
