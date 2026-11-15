import { ALGODONEROS_MLB_PLAYERS, ALGODONEROS_MLB_PROSPECTS } from "./algodonerosMlbPaths";
import { LMB_CLUB_DIRECTORY } from "./lmbClubs";
import { getLmbToMlbClub } from "./lmbToMlb";
import { MLB_MEXICO_VERIFIED_CONNECTIONS } from "./mlbMexicoVerifiedConnections";
import type { MlbClub } from "./mlbClubDirectory";

// Las conexiones enlazan LMB y LMP en ambos sentidos. Debut, regreso y firma
// de sucursales son hechos distintos; la ausencia de registros no significa cero.
export type MexicanConnection = {
  name: string;
  league: "LMB" | "LMP";
  direction: "mexico-to-mlb" | "mlb-to-mexico";
  mexicanClub: string;
  mexicanSlug: string;
  role: string;
  year: string;
  description: string;
  source: string;
  verificationSource?: string;
};

export type MlbMexicanConnections = {
  debuts: MexicanConnection[];
  previousExperience: MexicanConnection[];
  prospects: MexicanConnection[];
  toMexico: MexicanConnection[];
};

const normalize = (value: string) => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function isOrganization(organization: string, club: MlbClub): boolean {
  const candidate = normalize(organization.split(" · ")[0]);
  const official = normalize(club.name);
  return candidate === official || (club.id === 133 && candidate === "oakland athletics");
}

const recentFirst = (a: MexicanConnection, b: MexicanConnection) => {
  const year = (value: string) => Number(value.match(/20\d{2}/)?.[0] ?? 0);
  return year(b.year) - year(a.year) || a.name.localeCompare(b.name, "es");
};

export function getMlbMexicanConnections(club: MlbClub): MlbMexicanConnections {
  const result: MlbMexicanConnections = {
    debuts: [], previousExperience: [], prospects: [], toMexico: [],
  };

  for (const mexican of LMB_CLUB_DIRECTORY) {
    const record = getLmbToMlbClub(mexican.slug);
    if (!record) continue;

    for (const debut of record.debuts) {
      if (!isOrganization(debut.mlbClub, club)) continue;
      result.debuts.push({
        name: debut.title, league: "LMB", direction: "mexico-to-mlb",
        mexicanClub: mexican.name, mexicanSlug: mexican.slug,
        role: "Pelotero", year: debut.debutDate, description: debut.description,
        source: debut.source,
      });
    }

    for (const prospect of record.prospects) {
      if (!isOrganization(prospect.organization, club)) continue;
      // Si este mismo debut ya está acreditado, evitar una segunda tarjeta
      // que lo clasifique incorrectamente como «sin debut confirmado».
      if (result.debuts.some(item => item.mexicanSlug === mexican.slug &&
        normalize(item.name) === normalize(prospect.name))) continue;
      const destination = prospect.priorMlbDebut
        ? result.previousExperience : result.prospects;
      destination.push({
        name: prospect.name, league: "LMB", direction: "mexico-to-mlb",
        mexicanClub: mexican.name, mexicanSlug: mexican.slug,
        role: prospect.role, year: prospect.seasonLabel,
        description: prospect.note + (prospect.priorMlbDebut
          ? ` Debut anterior en MLB: ${prospect.priorMlbDebut}.` : ""),
        source: prospect.source, verificationSource: prospect.confirmationSource,
      });
    }
  }

  // Ficha de Algodoneros del Unión Laguna: su investigación verificada usa
  // una fuente editorial separada de la colección de los demás clubes LMB.
  for (const player of ALGODONEROS_MLB_PLAYERS) {
    if (!isOrganization(player.team, club)) continue;
    const destination = player.category === "mlb" ? result.debuts
      : player.category === "return" ? result.previousExperience : result.prospects;
    destination.push({
      name: player.name, league: "LMB", direction: "mexico-to-mlb",
      mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", role: player.role, year: player.year,
      description: player.description, source: player.source,
    });
  }
  for (const prospect of ALGODONEROS_MLB_PROSPECTS) {
    if (!isOrganization(prospect.organization, club)) continue;
    result.prospects.push({
      name: prospect.name, league: "LMB", direction: "mexico-to-mlb",
      mexicanClub: "Algodoneros del Unión Laguna",
      mexicanSlug: "algodoneros", role: prospect.role, year: prospect.year,
      description: prospect.detail, source: prospect.source,
    });
  }

  // Expedientes verificados individualmente, sin extrapolar un caso a todas
  // las franquicias ni equiparar una firma con una aparición en Grandes Ligas.
  for (const item of MLB_MEXICO_VERIFIED_CONNECTIONS) {
    if (item.mlbClubId !== club.id) continue;
    const target = item.group === "debut" ? result.debuts
      : item.group === "previousExperience" ? result.previousExperience
      : item.group === "prospect" ? result.prospects : result.toMexico;
    if (!target.some(person => person.league === item.connection.league &&
      person.mexicanSlug === item.connection.mexicanSlug &&
      normalize(person.name) === normalize(item.connection.name))) {
      target.push(item.connection);
    }
  }

  result.debuts.sort(recentFirst);
  result.previousExperience.sort(recentFirst);
  result.prospects.sort(recentFirst);
  result.toMexico.sort(recentFirst);
  return result;
}
