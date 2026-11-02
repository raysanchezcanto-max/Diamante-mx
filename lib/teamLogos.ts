export type LeagueCode = "MLB" | "LMB" | "LMP";

const LMP_LOGOS: Record<string, string> = {
  "jaguares de nayarit":
    "/logos/lmp/jaguares-nayarit.svg",

  "tomateros de culiacan":
    "/logos/lmp/tomateros-culiacan.svg",

  "naranjeros de hermosillo":
    "/logos/lmp/naranjeros-hermosillo.svg",

  "yaquis de obregon":
    "/logos/lmp/yaquis-obregon.svg",

  "charros de jalisco":
    "/logos/lmp/charros-jalisco.png",

  "caneros de los mochis":
    "/logos/lmp/caneros-mochis.svg",

  "aguilas de mexicali":
    "/logos/lmp/aguilas-mexicali.svg",

  "algodoneros de guasave":
    "/logos/lmp/algodoneros-guasave.png",

  "tucson baseball team":
    "/logos/lmp/tucson.png",
  "mayos de navojoa":
    "/logos/lmp/mayos-navojoa.png",
  "venados de mazatlan":
    "/logos/lmp/venados-mazatlan.png",
  };

  const LMB_LOGOS: Record<string, string> = {
  "toros de tijuana":
    "/logos/lmb/toros-tijuana.png",

  "caliente de durango":
    "/logos/lmb/caliente-durango.png",

  "sultanes de monterrey":
    "/logos/lmb/sultanes-monterrey.png",

  "charros de jalisco":
    "/logos/lmb/charros-jalisco.png",

  "acereros del norte":
    "/logos/lmb/acereros-monclova.png",

  "acereros de monclova":
    "/logos/lmb/acereros-monclova.png",

  "algodoneros union laguna":
    "/logos/lmb/algodoneros-union-laguna.png",

  "algodoneros de union laguna":
    "/logos/lmb/algodoneros-union-laguna.png",

  "rieleros de aguascalientes":
    "/logos/lmb/rieleros-aguascalientes.png",

  "saraperos de saltillo":
    "/logos/lmb/saraperos-saltillo.png",

  "tecos de los dos laredos":
    "/logos/lmb/tecos-dos-laredos.png",

  "dorados de chihuahua":
    "/logos/lmb/dorados-chihuahua.png",

  "diablos rojos del mexico":
    "/logos/lmb/diablos-rojos-mexico.png",

  "diablos rojos del méxico":
    "/logos/lmb/diablos-rojos-mexico.png",

  "olmecas de tabasco":
    "/logos/lmb/olmecas-tabasco.png",

  "piratas de campeche":
    "/logos/lmb/piratas-campeche.png",

  "pericos de puebla":
    "/logos/lmb/pericos-puebla.png",

  "bravos de leon":
    "/logos/lmb/bravos-leon.png",

  "guerreros de oaxaca":
    "/logos/lmb/guerreros-oaxaca.png",

  "el aguila de veracruz":
    "/logos/lmb/aguila-veracruz.png",

  "aguila de veracruz":
    "/logos/lmb/aguila-veracruz.png",

  "tigres de quintana roo":
    "/logos/lmb/tigres-quintana-roo.png",

  "conspiradores de queretaro":
    "/logos/lmb/conspiradores-queretaro.png",

  "leones de yucatan":
    "/logos/lmb/leones-yucatan.png",
};

function normalizeTeamName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}


// Nombres visibles de LMP. Se conservan intactos los nombres de la API
// para búsquedas, identificadores y resolución de logos.
const LMP_DISPLAY_NAMES: Record<string, string> = {
  "algodoneros de guasave": "Algodoneros de Guasave",
  "aguilas de mexicali": "Águilas de Mexicali",
  "naranjeros de hermosillo": "Naranjeros de Hermosillo",
  "tomateros de culiacan": "Tomateros de Culiacán",
  "charros de jalisco": "Charros de Jalisco",
  "yaquis de obregon": "Yaquis de Obregón",
  "venados de mazatlan": "Venados de Mazatlán",
  "caneros de los mochis": "Cañeros de Los Mochis",
  "mayos de navojoa": "Mayos de Navojoa",
  "jaguares de nayarit": "Jaguares de Nayarit",
};

// Nombres de equipos utilizados exclusivamente para mostrar texto.
// Se preserva la respuesta original de las API para identificadores y lógica.
const LMB_DISPLAY_NAMES: Record<string, string> = {
  "toros": "Toros de Tijuana",
  "toros de tijuana": "Toros de Tijuana",
  "caliente": "Caliente de Durango",
  "caliente de durango": "Caliente de Durango",
  "sultanes": "Sultanes de Monterrey",
  "sultanes de monterrey": "Sultanes de Monterrey",
  "charros": "Charros de Jalisco",
  "charros de jalisco": "Charros de Jalisco",
  "acereros": "Acereros del Norte",
  "acereros del norte": "Acereros del Norte",
  "acereros de monclova": "Acereros de Monclova",
  "algodoneros": "Algodoneros del Unión Laguna",
  "algodoneros union laguna": "Algodoneros del Unión Laguna",
  "algodoneros de union laguna": "Algodoneros del Unión Laguna",
  "rieleros": "Rieleros de Aguascalientes",
  "rieleros de aguascalientes": "Rieleros de Aguascalientes",
  "saraperos": "Saraperos de Saltillo",
  "saraperos de saltillo": "Saraperos de Saltillo",
  "tecos": "Tecos de los Dos Laredos",
  "tecos de los dos laredos": "Tecos de los Dos Laredos",
  "dorados": "Dorados de Chihuahua",
  "dorados de chihuahua": "Dorados de Chihuahua",
  "diablos": "Diablos Rojos del México",
  "diablos rojos": "Diablos Rojos del México",
  "diablos rojos del mexico": "Diablos Rojos del México",
  "olmecas": "Olmecas de Tabasco",
  "olmecas de tabasco": "Olmecas de Tabasco",
  "piratas": "Piratas de Campeche",
  "piratas de campeche": "Piratas de Campeche",
  "pericos": "Pericos de Puebla",
  "pericos de puebla": "Pericos de Puebla",
  "bravos": "Bravos de León",
  "bravos de leon": "Bravos de León",
  "guerreros": "Guerreros de Oaxaca",
  "guerreros de oaxaca": "Guerreros de Oaxaca",
  "el aguila": "El Águila de Veracruz",
  "aguila": "El Águila de Veracruz",
  "el aguila de veracruz": "El Águila de Veracruz",
  "aguila de veracruz": "El Águila de Veracruz",
  "tigres": "Tigres de Quintana Roo",
  "tigres de quintana roo": "Tigres de Quintana Roo",
  "conspiradores": "Conspiradores de Querétaro",
  "conspiradores de queretaro": "Conspiradores de Querétaro",
  "leones": "Leones de Yucatán",
  "leones de yucatan": "Leones de Yucatán"
};

const CARIBE_DISPLAY_NAMES: Record<string, string> = {
  "mexico": "México",
  "mexico rojo": "México Rojo",
  "mexico verde": "México Verde",
  "mexico red": "México Rojo",
  "mexico green": "México Verde",
  "republica dominicana": "República Dominicana",
  "dominican republic": "República Dominicana",
  "dominicana": "República Dominicana",
  "puerto rico": "Puerto Rico",
  "venezuela": "Venezuela"
};

// MLB conserva los nombres oficiales en inglés; no traducimos marcas.
export function getTeamDisplayName(
  league: LeagueCode | "CARIBE",
  teamName: string
): string {
  const normalized = normalizeTeamName(teamName);
  if (league === "LMP") {
    return LMP_DISPLAY_NAMES[normalized] ?? teamName;
  }
  if (league === "LMB") {
    return LMB_DISPLAY_NAMES[normalized] ?? teamName;
  }
  if (league === "CARIBE") {
    return CARIBE_DISPLAY_NAMES[normalized] ??
      LMP_DISPLAY_NAMES[normalized] ??
      LMB_DISPLAY_NAMES[normalized] ??
      teamName;
  }
  return teamName;
}

export function getTeamLogo(
  league: LeagueCode,
  teamId: number,
  teamName: string
): string | null {
  if (league === "MLB") {
    if (!teamId) {
      return null;
    }

    return `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${teamId}.svg`;
  }

  if (league === "LMP") {
    const normalizedName =
      normalizeTeamName(teamName);

    return LMP_LOGOS[normalizedName] ?? null;
  }

  if (league === "LMB") {
    const normalizedName =
      normalizeTeamName(teamName);

    const exactLogo =
      LMB_LOGOS[normalizedName];

    if (exactLogo) {
      return exactLogo;
    }

    const matchingKey =
      Object.keys(LMB_LOGOS).find(
        (key) =>
          key === normalizedName ||
          key.startsWith(`${normalizedName} `) ||
          normalizedName.startsWith(`${key} `)
      );

    return matchingKey
      ? LMB_LOGOS[matchingKey]
      : null;
  }

  return null;
}
