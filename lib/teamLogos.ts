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

  /*
    Los logos LMB se agregarán en el
    siguiente paso.
  */
  return null;
}
