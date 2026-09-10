export type LeagueCode = "MLB" | "LMP";

const LMP_LOGOS: Record<string, string> = {
  "jaguares de nayarit":
    "/logos/lmp/jaguares-nayarit.png",

  "tomateros de culiacan":
    "/logos/lmp/tomateros-culiacan.png",

  "naranjeros de hermosillo":
    "/logos/lmp/naranjeros-hermosillo.png",

  "yaquis de obregon":
    "/logos/lmp/yaquis-obregon.png",

  "charros de jalisco":
    "/logos/lmp/charros-jalisco.png",

  "caneros de los mochis":
    "/logos/lmp/caneros-mochis.png",

  "aguilas de mexicali":
    "/logos/lmp/aguilas-mexicali.png",

  "algodoneros de guasave":
    "/logos/lmp/algodoneros-guasave.png",

  "tucson baseball team":
    "/logos/lmp/tucson.png",
  "mayos de navojoa":
    "/logos/lmp/mayos-navojoa.png",
  "venados de mazatlan":
    "/logos/lmp/venados-mazatlan.png",
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

  const normalizedName =
    normalizeTeamName(teamName);

  return LMP_LOGOS[normalizedName] ?? null;
}
