/** Catálogo canónico de las 30 franquicias MLB; IDs de MLB StatsAPI. */
export type MlbClub = { id: number; name: string; webSlug: string };
export const MLB_CLUBS: readonly MlbClub[] = [
  { id: 109, name: "Arizona Diamondbacks", webSlug: "dbacks" },
  { id: 144, name: "Atlanta Braves", webSlug: "braves" },
  { id: 110, name: "Baltimore Orioles", webSlug: "orioles" },
  { id: 111, name: "Boston Red Sox", webSlug: "redsox" },
  { id: 112, name: "Chicago Cubs", webSlug: "cubs" },
  { id: 145, name: "Chicago White Sox", webSlug: "whitesox" },
  { id: 113, name: "Cincinnati Reds", webSlug: "reds" },
  { id: 114, name: "Cleveland Guardians", webSlug: "guardians" },
  { id: 115, name: "Colorado Rockies", webSlug: "rockies" },
  { id: 116, name: "Detroit Tigers", webSlug: "tigers" },
  { id: 117, name: "Houston Astros", webSlug: "astros" },
  { id: 118, name: "Kansas City Royals", webSlug: "royals" },
  { id: 108, name: "Los Angeles Angels", webSlug: "angels" },
  { id: 119, name: "Los Angeles Dodgers", webSlug: "dodgers" },
  { id: 146, name: "Miami Marlins", webSlug: "marlins" },
  { id: 158, name: "Milwaukee Brewers", webSlug: "brewers" },
  { id: 142, name: "Minnesota Twins", webSlug: "twins" },
  { id: 121, name: "New York Mets", webSlug: "mets" },
  { id: 147, name: "New York Yankees", webSlug: "yankees" },
  { id: 133, name: "Athletics", webSlug: "athletics" },
  { id: 143, name: "Philadelphia Phillies", webSlug: "phillies" },
  { id: 134, name: "Pittsburgh Pirates", webSlug: "pirates" },
  { id: 135, name: "San Diego Padres", webSlug: "padres" },
  { id: 137, name: "San Francisco Giants", webSlug: "giants" },
  { id: 136, name: "Seattle Mariners", webSlug: "mariners" },
  { id: 138, name: "St. Louis Cardinals", webSlug: "cardinals" },
  { id: 139, name: "Tampa Bay Rays", webSlug: "rays" },
  { id: 140, name: "Texas Rangers", webSlug: "rangers" },
  { id: 141, name: "Toronto Blue Jays", webSlug: "bluejays" },
  { id: 120, name: "Washington Nationals", webSlug: "nationals" },
] as const;
const clubsById = new Map(MLB_CLUBS.map(club => [club.id, club]));
export function getMlbClub(id: number): MlbClub | null { return clubsById.get(id) ?? null; }
export function mlbClubHref(id: number): string | null { return clubsById.has(id) ? "/equipos/mlb/" + id : null; }
export function mlbOfficialTeamUrl(club: MlbClub): string { return "https://www.mlb.com/" + club.webSlug; }
